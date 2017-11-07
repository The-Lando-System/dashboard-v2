import { Injectable, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { RequestService } from './request.service';
import { NotificationService } from './notification.service';

import { Globals } from '../globals';

@Injectable()
export class WidgetTemplateService implements OnInit {

    private widgetsUrl = Globals.SVC_DOMAIN + '/widget/template';

    private widgets:Widget[] = [];

    constructor(
        private authSvc: AuthService,
        private requestSvc: RequestService,
        private notificationSvc: NotificationService
    ) {}

    ngOnInit(): void {}

    retrieveWidgets(): Promise<Widget[]> {
      return new Promise<Widget[]>((resolve,reject) => {
        this.requestSvc.get(this.widgetsUrl, this.authSvc.createAuthHeaders())
        .then((widgets:Widget[]) => {
          this.widgets = widgets;
          this.orderWidgetTemplates(this.widgets);
          resolve(widgets);
        }).catch((err:Response) => {
          this.notificationSvc.fail('Failed to retrieve widgets!');
          reject();
        });
      });
    }

    getWidgetsByIds(ids:string[]): Widget[] {
      let widgets:Widget[] = [];
      for (let widget of this.widgets) {
        if (ids.includes(widget.id))
          widgets.push(widget);
      }
      return widgets;
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

      return new Promise<Widget>((resolve,reject) => {
        this.requestSvc.post(this.widgetsUrl, newWidget, this.authSvc.createAuthHeaders())
        .then((widget:Widget) => {
          this.notificationSvc.success('Successfully created new widget!');
          resolve(widget);
        }).catch((err:Response) => {
          this.notificationSvc.fail('Failed to create new widget!');
          reject();
        });
      });
    }

    deleteWidget(widget:Widget): Promise<void> {
      return new Promise<void>((resolve,reject) => {
        this.requestSvc.delete(`${this.widgetsUrl}/${widget.id}`, this.authSvc.createAuthHeaders())
        .then(() => {
          this.notificationSvc.success('Successfully deleted widget!');
          resolve();
        }).catch((err:Response) => {
          this.notificationSvc.fail('Failed to delete widget!');
          reject();
        });
      });
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
      return new Promise<void>((resolve,reject) => {
        this.requestSvc.put(`${this.widgetsUrl}/${widgetId}`, widgetUpdate, this.authSvc.createAuthHeaders())
        .then(() => {
          this.notificationSvc.success('Successfully updated widget!');
          resolve();
        }).catch((err:Response) => {
          this.notificationSvc.fail('Failed to update widget!');
          reject();
        });
      });
    }

    saveWidgetOrder(widgets:Widget[]): Promise<void> {
      return new Promise<void>((resolve, reject) => {

        let count = 0;

        for(var i=0; i<widgets.length; i++) {          
          let widgetUpdate = {
            'position': `${i}`
          }
          this.updateWidget(widgetUpdate,widgets[i].id)
          .then((res:any) => {
            count++;
            if (count === widgets.length) {
              resolve();
            }
          });
        }
      });
    }

    private orderWidgetTemplates(widgets:Widget[]): void {
      widgets.sort((a:Widget, b:Widget) => {
        return parseInt(a.position) - parseInt(b.position);
      });
    }
}

export class Widget {
  id: string;
  userId: string;
  name: string;
  html: string;
  replacedHtml: string;
  clientIds: string[];
  tokens: string[];
  displayable: boolean;
  position: string;
}