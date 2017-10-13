export class ClientConfig {
    id: string;
    name: string;
    tokens: Token[];
    url: string;
    method: string;
    interval: number;
}

export class Token {
    name: string;
    parseRules: string[];
}