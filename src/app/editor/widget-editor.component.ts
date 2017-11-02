import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { Broadcaster } from 'sarlacc-angular-client';

import { WidgetTemplateService, Widget } from '../services/widget-template.service';
import { ClientConfigService, ClientConfig, Token } from '../services/client-config.service';

@Component({
  moduleId: module.id,
  selector: 'widget-editor',
  templateUrl: 'widget-editor.component.html',
  styleUrls: [ 'widget-editor.component.css' ],
  providers: []
})
export class WidgetEditorComponent implements OnInit {
    
  private activeTab: string = 'preview';
  private widget: Widget;
  private tokens: Token[];
  private allClients: ClientConfig[];
  private widgetClients: ClientConfig[];

  constructor(
    private broadcaster: Broadcaster,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
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

  createWidget(): void {
    this.widgetTemplateSvc.createWidget(this.widget)
    .then((newWidget:Widget) => {
      this.widget = newWidget;
      this.widget.displayable = true;
    })
  }

  deleteWidget(): void {
    if (!confirm('Are you sure want to delete this widget?'))
      return;

    this.widgetTemplateSvc.deleteWidget(this.widget)
    .then((res:any) => {
      let link = ['/'];
      this.router.navigate(link);
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
          this.widget.clientIds = [];
          this.widget.tokens = [];
        }
        this.initializeWidgetClients();
      });
    } else {
        this.widget = new Widget();
        this.widget.name = 'New Widget';
        this.widget.clientIds = [];
        this.widget.tokens = [];
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
      this.initializeWidgetClients();
    });

  }

  removeTokenFromWidget(token:string): void {
    event.preventDefault();
    this.widgetTemplateSvc.removeTokenFromWidget(this.widget, token)
    .then((res:any) => {
      this.initializeWidgetClients();
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