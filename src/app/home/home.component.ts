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
  private dragOverWidgetId: string;

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

  sanitizeHtml(html:string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onDragStart(event, widgetId): void {
    event.dataTransfer.setData('widgetId', widgetId);
  }

  onDragOver(event, widgetId): void {
    event.preventDefault();
    if (widgetId === this.dragOverWidgetId)
      return;
    this.dragOverWidgetId = widgetId;
  }

  onDragLeave(event): void {
    event.preventDefault();
    this.dragOverWidgetId = '';
  }

  onDrop(event, widgetId): void {
    this.dragOverWidgetId = '';
    let droppedWidgetId = event.dataTransfer.getData('widgetId');
    this.swapWidgetPositions(widgetId, droppedWidgetId);
    event.preventDefault();
  }

  private swapWidgetPositions(widget1Id:string, widget2Id:string): void {

    let index1 = this.findWidgetIndexById(widget1Id);
    let index2 = this.findWidgetIndexById(widget2Id);

    if (index1 === -1 || index2 === -1)
      return;

    var temp = this.widgets[index1];
    this.widgets[index1] = this.widgets[index2];
    this.widgets[index2] = temp;
  }

  private findWidgetIndexById(id:string): number {
    for(var i=0; this.widgets.length; i++) {
      if (this.widgets[i].id === id) {
        return i;
      }
    }
    return -1;
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

}