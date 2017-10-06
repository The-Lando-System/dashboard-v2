import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Globals } from '../globals';

import { Widget, WidgetToken } from '../widget/widget';

@Injectable()
export class WidgetTemplateService {

    constructor(
        private globals: Globals,
        private http: Http
    ) {}

    getWidgets(): Widget[] {
        return this.createTestWidgets();
    }

    // TEST METHODS

    private createTestWidgets(): Widget[] {
        let widgets: Widget[] = [];

        let widget1 = new Widget();
        widget1.name = 'Widget 1';
        widget1.id = '1';
        widget1.html = 
            '<h4>Dictionary Svc Call 1: [${WORD1}]</h4>' +
            '<h4>Dictionary Svc Call 2: [${WORD2}]</h4>';
        widget1.tokens = this.createTokens();

        console.log(JSON.stringify(widget1,null,2));

        widgets.push(widget1);

        return widgets;
    }

    private createTokens(): WidgetToken[] {
        let tokens: WidgetToken[] = [];

        let token1: WidgetToken = new WidgetToken();
        token1.name = 'WORD1';
        tokens.push(token1);

        let token2: WidgetToken = new WidgetToken();
        token2.name = 'WORD2';
        tokens.push(token2);

        return tokens;
    }
}