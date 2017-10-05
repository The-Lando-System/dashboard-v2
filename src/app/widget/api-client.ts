export class ApiClient {
    name: string;
    endpoints: Endpoint[];
}

export class Endpoint {
    url: string;
    method: RequestMethod;
    params: string[];
    pathVariables: string[];
    body: string[];
    headers: Header[];
}

export class Header {
    key: string;
    value: string;
}

export enum RequestMethod {
    GET,
    POST,
    PUT,
    DELETE
}