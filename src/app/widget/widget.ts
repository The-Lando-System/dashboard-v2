export class Widget {
    id: string;
    name: string;
    html: string;
    tokens: WidgetToken[];
}

export class WidgetToken {
    name: string;
    value: string;
}