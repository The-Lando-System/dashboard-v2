import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { ClientConfig } from '../client/client-config';

import { Globals } from '../globals';

@Injectable()
export class ClientConfigService implements OnInit {

    private clientConfigUrl = this.globals.service_domain + '/client';

    private clientConfigs:ClientConfig[] = [];

    constructor(
        private globals: Globals,
        private http: Http
    ) {}

    ngOnInit(): void {}

    retrieveClientConfigs(): Promise<ClientConfig[]> {
        return this.http.get(this.clientConfigUrl)
        .toPromise()
        .then((res:any) => {
            this.clientConfigs = res.json();
            return this.clientConfigs;
        }).catch((err:any) => { console.log(err); return null; });
    }

    getWidgetById(id:string): ClientConfig {
        for (let clientConfig of this.clientConfigs) {
            if (clientConfig.id === id)
                return clientConfig;
        }
        return null;
    }
}