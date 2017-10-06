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
        this.socket.on('value', this.broadcastTemplate.bind(this));
    }

    private broadcastTemplate(tokenMessage): void {
        console.log(tokenMessage);
        
        let widget:Widget = this.widgets[0];

        for (let token of widget.tokens) {
            if (tokenMessage.hasOwnProperty(token.name)) {
                token.value = tokenMessage[token.name];
                widget.html = this.tokenReplacer.replaceToken(token.name, token.value, widget.html);
                this.widgetStatus[token.name] = true;
                if (this.allTokensReplaced(this.widgetStatus)) {
                    let message = {};
                    message[widget.id] = widget.html;
            
                    this.broadcaster.broadcast('TEMPLATE_UPDATE', message);
    
                    this.resetWidgetStatus(this.widgetStatus, widget);

                    this.widgets = this.widgetTemplateSvc.getWidgets();
                }
            } 
        }
    }

    private allTokensReplaced(widgetStatus:any): boolean {
        for (let key of Object.keys(widgetStatus)){
            if (!widgetStatus[key]) {
                return false;
            }
        }
        return true;
    }

    private resetWidgetStatus(widgetStatus:any, widget:Widget): void {
        for (let token of widget.tokens) {
            widgetStatus[token.name] = false;
        }
    }
}