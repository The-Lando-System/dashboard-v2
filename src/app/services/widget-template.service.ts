import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { Globals } from '../globals';

import { Widget, WidgetToken } from '../widget/widget';

@Injectable()
export class WidgetTemplateService implements OnInit {

    private widgets:Widget[] = [];

    constructor(
        private globals: Globals,
        private http: Http
    ) {}

    ngOnInit(): void {
        this.widgets = this.createTestWidgets();
    }

    getWidgets(): Widget[] {
        if (this.widgets.length === 0) {
            this.widgets = this.createTestWidgets();
        }

        return this.widgets;
    }

    getWidgetById(id:string): Widget {
        for (let widget of this.widgets) {
            if (widget.id === id)
                return widget;
        }
        return null;
    }

    // TEST METHODS

    private createTestWidgets(): Widget[] {
        let widgets: Widget[] = [];

        widgets.push(this.createTestWidget(
            'Widget 1',
            '<h4>Dictionary Svc Call 1: [${WORD1}]</h4>',
            ['WORD1'],
            ['1']
        ));

        widgets.push(this.createTestWidget(
            'Colorado Springs Weather',
            '<div class="row">' +
            '<div style="margin-left:30px"><h4><strong>${CURRENT_TEMP}</strong></h4></div>' +
            '<div style="margin-left:20px; margin-top:-10px"><img src="${CURRENT_TEMP_ICON}" class="img-fluid"></div>' +
            '</div>' +
            '<div class="col-md-12"><h4>${OBS_TIME}</h4></div>',
            ['CURRENT_TEMP','CURRENT_TEMP_ICON','OBS_TIME'],
            ['2']
        ));

        return widgets;
    }

    private createTestWidget(widgetName:string, html:string, tokenNames:string[], clientIds:string[]): Widget {
        let widget:Widget = new Widget();
        widget.id = this.uuidv4();
        widget.name = widgetName;
        widget.html = html;
        widget.clientIds = clientIds;
        widget.tokens = tokenNames.map(tokenName => this.createTestToken(tokenName));
        widget.displayable = false;
        return widget;
    }

    private uuidv4():string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private createTestToken(name:string): WidgetToken {
        let token:WidgetToken = new WidgetToken();
        token.name = name;
        return token;
    }
}