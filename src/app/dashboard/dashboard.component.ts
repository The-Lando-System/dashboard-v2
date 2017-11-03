import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Broadcaster } from 'sarlacc-angular-client';

import { DashboardService, Dashboard } from '../services/dashboard.service';
import { WidgetTemplateService, Widget } from '../services/widget-template.service';

import { OrchestratorService } from '../services/orchestrator.service';

declare var io: any;

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: [ 'dashboard.component.css' ],
  providers: []
})
export class DashboardComponent implements OnInit {

  private dashboard: Dashboard;
  private widgets: Widget[] = [];
  private dragOverWidgetId: string;
  private updatesPaused: boolean = false;

  socket: any;

  constructor(
    private broadcaster: Broadcaster,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dashboardSvc: DashboardService,
    private widgetTemplateSvc: WidgetTemplateService,
    private orchestratorSvc: OrchestratorService
  ){}

  ngOnInit(): void {
    this.activatedRoute.params.forEach((params: Params) => {
      let dashboardId = params['dashboardId'];
      if (dashboardId) {
        this.dashboardSvc.getDashboardById(dashboardId)
        .then((dashboard:Dashboard) => {
          this.dashboard = dashboard;

          this.broadcaster.broadcast('DASHBOARD_SELECTED', this.dashboard.id);

          this.widgetTemplateSvc.retrieveWidgets()
          .then((widgets:Widget[]) => {
            this.widgets = widgets;
            this.orchestratorSvc.start();
            this.listenForTemplates();  
          });
        }).catch((err:any) => {
          this.router.navigate(['/']);
        });
      }
    });
  }

  sanitizeHtml(html:string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onDragStart(event, widgetId): void {
    event.dataTransfer.setData('widgetId', widgetId);
    this.updatesPaused = true;
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
    this.widgetTemplateSvc.saveWidgetOrder(this.widgets);
    this.updatesPaused = false;
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
      if (!this.updatesPaused) {
        for (let widget of this.widgets) {
          if (message.hasOwnProperty(widget.id)) {
            widget.html = message[widget.id];
            widget.displayable = true;
          }
        }
      }
    });
  }

}