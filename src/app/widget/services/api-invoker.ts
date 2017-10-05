import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Endpoint,RequestMethod } from '../api-client';

@Injectable()
export class ApiInvoker {

    constructor(
        private http: Http
    ){}
    
    public invokeRequest(endpoint:Endpoint): Promise<any> {
        // TODO
        switch (endpoint.method) {
            case RequestMethod.GET:
                return this.invokeGetRequest(endpoint);
            default:
                return this.invokeGetRequest(endpoint);
        }
    }

    private invokeGetRequest(endpoint:Endpoint): Promise<any> {

        let options = {};
        if (endpoint.headers) {
            options['headers'] = this.createHeaders(endpoint);
        }

        return this.http.get(endpoint.url, options)
        .toPromise()
        .then((res:any) => {
            return res.json();
        }).catch((err:any) => {
            console.log(err);
        });
    }

    private createHeaders(endpoint:Endpoint): Headers {
        let headers:Headers = new Headers();
        for (let header of endpoint.headers) {
            headers.append(header.key, header.value);
        }
        return headers;
    }

}