import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Broadcaster } from 'sarlacc-angular-client';
import { Widget } from '../widget/widget';

import { OrchestratorService } from '../services/orchestrator.service';
import { WidgetTemplateService } from '../services/widget-template.service';

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

  private widgets: Widget[] = [];

  constructor(
    private broadcaster: Broadcaster,
    private sanitizer: DomSanitizer,
    private orchestrator: OrchestratorService,
    private widgetTempalateSvc: WidgetTemplateService
  ){}

  ngOnInit(): void {

    this.widgetTempalateSvc.retrieveWidgets()
    .then((widgets:Widget[]) => {
      this.widgets = widgets;
      this.orchestrator.start();
      this.listenForTemplates();  
    });
  }


  private listenForTemplates(): void {
    this.broadcaster.on<string>('TEMPLATE_UPDATE')
    .subscribe(message => {
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