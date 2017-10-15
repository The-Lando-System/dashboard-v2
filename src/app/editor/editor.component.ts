import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

import { WidgetTemplateService } from '../services/widget-template.service';
import { Widget } from '../widget/widget';

import { ClientConfigService } from '../services/client-config.service';
import { ClientConfig, Token } from '../client/client-config';

@Component({
  moduleId: module.id,
  selector: 'editor',
  templateUrl: 'editor.component.html',
  styleUrls: [ 'editor.component.css' ],
  providers: []
})
export class EditorComponent implements OnInit {
    
  private activeTab: string = 'preview';
  private widget: Widget;
  private tokens: Token[];
  private allClients: ClientConfig[];
  private widgetClients: ClientConfig[];

  constructor(
    private broadcaster: Broadcaster,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private widgetTemplateSvc: WidgetTemplateService,
    private clientConfigService: ClientConfigService
  ){}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let widgetId = params['widgetId'];
      this.initWidgetById(widgetId);
    });
  }

  initializeWidgetClients(): void {
    this.clientConfigService.retrieveClientConfigs()
    .then((clients:ClientConfig[]) => {
      this.allClients = clients.filter(client => !this.widget.clientIds.includes(client.id));
      this.widgetClients = clients.filter(client => this.widget.clientIds.includes(client.id));
      this.tokens = this.clientConfigService.getTokensForClients(this.widgetClients);


      clients.forEach(client => {
        client.tokens = client.tokens.filter(token => {
          return !this.widget.tokens.includes(token.name);
        });
      });
    });
  }

  updateWidgetName(): void {
    this.widgetTemplateSvc.updateWidgetName(this.widget)
    .then((res:any) => {
      console.log('Widget was updated!');
    });
  }

  setActiveTab(activeTab): void {
    event.preventDefault();
    this.activeTab = activeTab;
  }

  initWidgetById(id:string): void {
    if (id) {
      this.widgetTemplateSvc.retrieveWidgets()
      .then((res:any) => {
        this.widget = this.widgetTemplateSvc.getWidgetById(id);
        if (this.widget == null) {
          this.widget = new Widget();
          this.widget.name = 'New Widget';
        }
        this.initializeWidgetClients();
      });
    } else {
        this.widget = new Widget();
        this.widget.name = 'New Widget';
        this.initializeWidgetClients();
    }
  }

  updateWidgetHtml(): void {
    this.widgetTemplateSvc.updateWidgetHtml(this.widget)
    .then((res:any) => {
      console.log('Widget was updated!');
    });
  }

  removeClientFromWidget(client:ClientConfig): void {
    event.preventDefault();

    this.widgetTemplateSvc.removeClientFromWidget(this.widget, client.id)
    .then((res:any) => {
      this.initializeWidgetClients();
    }); 

  }

  addTokenToWidget(token:Token): void {
    event.preventDefault();
    
    this.widgetTemplateSvc.addTokenToWidget(this.widget, token.name)
    .then((res:any) => {
      this.ngOnInit();
    });

  }

  removeTokenFromWidget(token:string): void {
    event.preventDefault();
    this.widgetTemplateSvc.removeTokenFromWidget(this.widget, token)
    .then((res:any) => {
      this.ngOnInit();
    })
  }

  addClientToWidget(client:ClientConfig): void {
    event.preventDefault();

    // add this client config id to the widget
    this.widgetTemplateSvc.addClientToWidget(this.widget,client.id)
    .then((res:any) => {
      this.initializeWidgetClients();
    });
  }

  sanitizeHtml(html:string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}