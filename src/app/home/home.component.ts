import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { UserService, User, Broadcaster } from 'sarlacc-angular-client';
import { Widget } from '../widget/widget';

import { OrchestratorService } from '../services/orchestrator.service';
import { WidgetTemplateService } from '../services/widget-template.service';

import { Globals } from '../globals';

declare var io: any;

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: []
})
export class HomeComponent implements OnInit {

  socket: any;

  private user: User;
  private widgets: Widget[] = [];

  constructor(
    private globals: Globals,
    private userSvc: UserService,
    private broadcaster: Broadcaster,
    private sanitizer: DomSanitizer,
    private orchestrator: OrchestratorService,
    private widgetTempalateSvc: WidgetTemplateService
  ){}

  ngOnInit(): void {
    this.initUser();
    this.listenForLogin();
    this.widgets = this.widgetTempalateSvc.getWidgets();
    this.orchestrator.start();
    this.listenForTemplates();
  }

  private initUser() {
    this.userSvc.returnUser()
    .then((user:User) => {
      this.user = user;
    }).catch(err => {});
  }
  
  private listenForLogin(): void {
    this.broadcaster.on<string>(this.userSvc.LOGIN_BCAST)
    .subscribe(message => {
      this.initUser();
    });
  }

  private listenForTemplates(): void {
    this.broadcaster.on<string>('TEMPLATE_UPDATE')
    .subscribe(message => {
      console.log(message);
      for (let widget of this.widgets) {
        if (message.hasOwnProperty(widget.id)) {
          widget.html = message[widget.id];
          widget.displayable = true;
        }
      }
    });
  }

  sanitizeHtml(html:string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}