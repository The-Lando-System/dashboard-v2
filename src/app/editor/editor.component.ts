import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

import { WidgetTemplateService } from '../services/widget-template.service';
import { Widget } from '../widget/widget';

@Component({
  moduleId: module.id,
  selector: 'editor',
  templateUrl: 'editor.component.html',
  styleUrls: [ 'editor.component.css' ],
  providers: []
})
export class EditorComponent implements OnInit {
    
  private widget: Widget;

  constructor(
    private broadcaster: Broadcaster,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private widgetTemplateSvc: WidgetTemplateService
  ){}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let widgetId = params['widgetId'];
      this.initWidgetById(widgetId);
    })
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
      });
    } else {
        this.widget = new Widget();
        this.widget.name = 'New Widget';
    }
  }

  updateWidgetHtml(): void {
    this.widgetTemplateSvc.updateWidgetHtml(this.widget)
    .then((res:any) => {
      console.log('Widget was updated!');
    });
  }

  sanitizeHtml(html:string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}