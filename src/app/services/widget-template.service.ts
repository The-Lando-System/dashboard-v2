import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Globals } from '../globals';

import { Widget } from '../widget/widget';

@Injectable()
export class WidgetTemplateService implements OnInit {

    private widgetsUrl = this.globals.service_domain + '/widget/template';

    private widgets:Widget[] = [];

    constructor(
        private globals: Globals,
        private http: Http
    ) {}

    ngOnInit(): void {}

    retrieveWidgets(): Promise<Widget[]> {
        return this.http.get(this.widgetsUrl)
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
        'html': widget.html,
      };

      return this.updateWidget(widgetUpdate,widget.id);
    }

    addClientToWidget(widget:Widget, clientId:string): Promise<void> {
      
      widget.clientIds.push(clientId);

      let widgetUpdate = {
        'clientIds': widget.clientIds,
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
        console.log("Failed to remove client ID!");
        return null;
      }

      widget.clientIds.splice(deleteIndex, 1);

      let widgetUpdate = {
        'clientIds': widget.clientIds,
      };

      return this.updateWidget(widgetUpdate,widget.id);

    }

    updateWidget(widgetUpdate:any, widgetId:string): Promise<void> {
      return this.http.put(`${this.widgetsUrl}/${widgetId}`, widgetUpdate, {headers:this.jsonHeaders()})
      .toPromise()
      .then((res:any) => {
      }).catch((err:any) => { console.log(err) });
    }

    private jsonHeaders(): Headers {
      return new Headers({
        'Content-Type'   : 'application/json'
      });
    }
}