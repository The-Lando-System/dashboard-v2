export class ClientConfig {
    id: string;
    name: string;
    tokens: Token[];
    url: string;
    method: RequestMethod;
    interval: number;
}

export class Token {
    name: string;
    parseRules: string[];
}

export enum RequestMethod {
    GET, PUT, POST, DELETE
}