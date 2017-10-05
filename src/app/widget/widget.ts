import { Endpoint } from './api-client';

export class Widget {
    name: string;
    html: string;
    js: string;
    tokens: WidgetToken[];
}

export class WidgetToken {
    name: string;
    value: string;
    responseParseRules: string[]; 
    endpoint: Endpoint;
}