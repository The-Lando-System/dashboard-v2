import { Injectable } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

import { Globals } from '../globals';

import { Widget } from '../widget/widget';

import { TokenService } from './token.service';
import { WidgetTemplateService } from './widget-template.service';
import { ClientConfigService } from './client-config.service';

declare var io: any;

@Injectable()
export class OrchestratorService {

    private socket: any;

    private widgets: Widget[] = [];
    private widgetStatus: any = {};

    constructor(
      private broadcaster: Broadcaster,
      private globals: Globals,
      private tokenService: TokenService,
      private widgetTemplateSvc: WidgetTemplateService,
      private clientConfigSvc: ClientConfigService
    ) {}

    start(): void {
      this.widgetTemplateSvc.retrieveWidgets()
      .then((widgets:Widget[]) => {
        this.widgets = widgets;
        this.initWidgetStatuses();
        this.connect();
        this.listenForRestart();
      });
    }

    private listenForRestart(): void {
      this.broadcaster.on('RESTART_CLIENTS').subscribe(() => {
        this.connect();
      });
    }

    private connect(): void {
      this.socket = io(this.globals.service_domain);
      this.socket.on('connect', this.subscribe.bind(this));
    }

    private subscribe(): void {
      this.clientConfigSvc.activateClients();
      this.socket.on('TOKEN_UPDATE', this.handleWidgetUpdates.bind(this));
    }

    // Handle the message published by the server to update widget tokens
    private handleWidgetUpdates(updateMessage): void {
        
        let widgetsToUpdate:Widget[] = this.getWidgetsWithClientId(updateMessage.client_id);

        for (let widget of widgetsToUpdate) {
            this.replaceTokensInWidget(updateMessage.parsed_values,widget);
        }
    }

    // Replace all tokens in a widget with values parsed from the server
    private replaceTokensInWidget(parsedValues:any,widget:Widget): void {
        for (let parsedValue of parsedValues) {
            for (let token of widget.tokens) {
                if (parsedValue.token_name !== token)
                    continue;

                this.replaceToken(token,parsedValue.parsed_value,widget);
                this.updateBroadcastStatus(widget,token);
            }
        }
    }

    // Set the value on the widget token, and replace the token in the HTML template
    private replaceToken(token:string,value:string,widget:Widget): void {
        widget.html = this.tokenService.replaceToken(token, value, widget.html);
    }

    // Mark the token as being replaced, and check if the template needs to be broadcast
    private updateBroadcastStatus(widget:Widget, token:string): void {
        this.widgetStatus[widget.id][token] = true;
        if (this.allTokensReplaced(widget)) {
            this.broadcastTemplateUpdate(widget);
            this.resetWidgetStatus(widget);
        }
    }

    // Send a broadcast message with an updated HTML template
    private broadcastTemplateUpdate(widget:Widget): void {
        let message = {};
        message[widget.id] = widget.html;
        this.broadcaster.broadcast('TEMPLATE_UPDATE', message);        
    }

    // Retrieve all widgets that contain the given client ID
    private getWidgetsWithClientId(clientId:string): Widget[] {
        return this.widgets.filter(w => 
            w.clientIds.filter(id => 
                id === clientId
            ).length > 0
        );
    }

    // True if all tokens for a given widget are replaced
    private allTokensReplaced(widget:Widget): boolean {
        for (let key of Object.keys(this.widgetStatus[widget.id])){
            if (!this.widgetStatus[widget.id][key]) {
                return false;
            }
        }
        return true;
    }

    // Reset the replacement statuses for all tokens in a widget
    private resetWidgetStatus(widget:Widget): void {
        for (let token of widget.tokens) {
            this.widgetStatus[widget.id][token] = false;
        }
    }

    // Initialize widget statuses
    private initWidgetStatuses(): void {
        for (let widget of this.widgets){
            this.widgetStatus[widget.id] = {};
            this.resetWidgetStatus(widget);
        }
    }
}