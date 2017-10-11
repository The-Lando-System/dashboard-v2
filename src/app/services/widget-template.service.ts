import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';

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
}