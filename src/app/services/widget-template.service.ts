import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { AuthService } from './auth.service';

import { Globals } from '../globals';

import { Widget } from '../widget/widget';

@Injectable()
export class WidgetTemplateService implements OnInit {

    private widgetsUrl = Globals.SVC_DOMAIN + '/widget/template';

    private widgets:Widget[] = [];

    constructor(
        private http: Http,
        private authSvc: AuthService
    ) {}

    ngOnInit(): void {}

    retrieveWidgets(): Promise<Widget[]> {
        return this.http.get(this.widgetsUrl, {headers:this.authSvc.createAuthHeaders()})
        .toPromise()
        .then((res:any) => {
            this.widgets = res.json();
            return this.widgets;
        }).catch((err:any) => { console.log(err); return null; });
    }

    getWidgetById(id:string): Widget {
        for (let widget of this.widgets) {
            if (widget.id === id)
                return widget;
        }
        return null;
    }

    updateWidgetHtml(widget:Widget): Promise<void> {

      let widgetUpdate = {
        'html': widget.html
      };

      return this.updateWidget(widgetUpdate,widget.id);
    }

    updateWidgetName(widget:Widget): Promise<void> {
      let widgetUpdate = {
        'name': widget.name
      };

      return this.updateWidget(widgetUpdate,widget.id);
    }

    createWidget(widget:Widget): Promise<Widget> {

      let newWidget = {
        'userId': widget.userId,
        'name': widget.name,
        'html': widget.html,
        'clientIds': widget.clientIds,
        'tokens': widget.tokens
      };

      return this.http.post(this.widgetsUrl, newWidget, {headers:this.authSvc.createAuthHeaders()})
      .toPromise()
      .then((res:any) => {
        return res.json();
      }).catch((err:any) => { console.log(err); });
    }

    deleteWidget(widget:Widget): Promise<void> {
      return this.http.delete(`${this.widgetsUrl}/${widget.id}`, {headers:this.authSvc.createAuthHeaders()})
      .toPromise()
      .then((res:any) => {}).catch((err:any) => { console.log(err) });
    }

    addTokenToWidget(widget:Widget, token:string): Promise<void> {
    
      widget.tokens.push(token);

      let widgetUpdate = {
        'tokens': widget.tokens
      };

      return this.updateWidget(widgetUpdate,widget.id);

    }

    removeTokenFromWidget(widget:Widget, token:string): Promise<void> {
      let deleteIndex = -1;
      for (let i = 0; i<widget.tokens.length; i++) {
        if (widget.tokens[i] === token) {
          deleteIndex = i;
          break;
        }
      }

      if (deleteIndex === -1) {
        console.log(`Failed to remove token with name [${token}]`);
        return null;
      }

      widget.tokens.splice(deleteIndex, 1);

      let widgetUpdate = {
        'tokens': widget.tokens
      };

      return this.updateWidget(widgetUpdate,widget.id);
    }

    addClientToWidget(widget:Widget, clientId:string): Promise<void> {
      
      widget.clientIds.push(clientId);

      let widgetUpdate = {
        'clientIds': widget.clientIds
      };

      return this.updateWidget(widgetUpdate,widget.id);
    }

    removeClientFromWidget(widget:Widget, clientId:string): Promise<void> {

      let deleteIndex = -1;
      for (let i = 0; i<widget.clientIds.length; i++) {
        if (widget.clientIds[i] === clientId) {
          deleteIndex = i;
          break;
        }
      }

      if (deleteIndex === -1) {
        console.log(`Failed to remove client with id [${clientId}]`);
        return null;
      }

      widget.clientIds.splice(deleteIndex, 1);

      let widgetUpdate = {
        'clientIds': widget.clientIds
      };

      return this.updateWidget(widgetUpdate,widget.id);

    }

    updateWidget(widgetUpdate:any, widgetId:string): Promise<void> {
      return this.http.put(`${this.widgetsUrl}/${widgetId}`, widgetUpdate, {headers:this.authSvc.createAuthHeaders()})
      .toPromise()
      .then((res:any) => {}).catch((err:any) => { console.log(err) });
    }
}