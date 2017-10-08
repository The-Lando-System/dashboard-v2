import { Injectable } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

import { Globals } from '../globals';

import { Widget } from '../widget/widget';

import { TokenReplacer } from './token-replacer';
import { WidgetTemplateService } from './widget-template.service';

declare var io: any;

@Injectable()
export class OrchestratorService {

    private socket: any;

    private widgets: Widget[] = [];
    private widgetStatus: any = {};

    constructor(
        private broadcaster: Broadcaster,
        private globals: Globals,
        private tokenReplacer: TokenReplacer,
        private widgetTemplateSvc: WidgetTemplateService
    ) {}

    start(): void {
        this.widgets = this.widgetTemplateSvc.getWidgets();
        for (let widget of this.widgets){
            this.widgetStatus[widget.id] = {};
            this.resetWidgetStatus(this.widgetStatus,widget);
        }
        this.connect();
        this.subscribe();
    }

    private connect(): void {
        this.socket = io(this.globals.service_domain);
        this.socket.on('connect', function() {
            console.log('Connected to dashboard-svc websocket!');
        });
    }

    private subscribe(): void {
        this.socket.on('TOKEN_UPDATE', this.handleWidgetUpdates.bind(this));
    }

    private handleWidgetUpdates(tokenUpdate): void {
        console.log(tokenUpdate);
        
        let widgetsToUpdate:Widget[] = this.widgets.filter(w => 
            w.clientIds.filter(id => 
                id === tokenUpdate.client_id
            ).length > 0
        );

        for (let widget of widgetsToUpdate) {

            for (let parsedValue of tokenUpdate.parsed_values) {
                for (let token of widget.tokens) {
                    if (parsedValue.token_name === token.name) {
                        token.value = parsedValue.parsed_value;
                        widget.html = this.tokenReplacer.replaceToken(token.name, token.value, widget.html);
                        this.widgetStatus[widget.id][token.name] = true;
                        if (this.allTokensReplaced(this.widgetStatus, widget)) {
                            let message = {};
                            message[widget.id] = widget.html;
                    
                            this.broadcaster.broadcast('TEMPLATE_UPDATE', message);
            
                            this.resetWidgetStatus(this.widgetStatus, widget);
                        }
                    } 
                }

            }
        }
    }


    private allTokensReplaced(widgetStatus:any, widget:Widget): boolean {
        for (let key of Object.keys(widgetStatus[widget.id])){
            if (!widgetStatus[widget.id][key]) {
                return false;
            }
        }
        return true;
    }

    private resetWidgetStatus(widgetStatus:any, widget:Widget): void {
        for (let token of widget.tokens) {
            widgetStatus[widget.id][token.name] = false;
        }
    }
}