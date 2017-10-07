export class Widget {
    id: string;
    name: string;
    html: string;
    clientIds: string[];
    tokens: WidgetToken[];
    displayable: boolean;
}

export class WidgetToken {
    name: string;
    value: string;
}