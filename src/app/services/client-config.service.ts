import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { ClientConfig, Token } from '../client/client-config';

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

    retrieveAllTokens(): Promise<Token[]> {
        return this.retrieveClientConfigs()
        .then((clientConfigs:ClientConfig[]) => {
            let tokens = [];
            clientConfigs.forEach(config => 
                config.tokens.forEach(token => 
                    tokens.push(token)
                )
            );
            return tokens;
        })
    }

    getAllTokens(): Token[] {
      let tokens = [];
      this.clientConfigs.forEach(config => 
          config.tokens.forEach(token => 
              tokens.push(token)
          )
      );
      return tokens;
    }

    getTokensForClients(clients:ClientConfig[]): Token[] {
      let tokens = [];
      clients.forEach(client => {
        client.tokens.forEach(token => {
          tokens.push(token);
        });
      });
      return tokens;
    }
}