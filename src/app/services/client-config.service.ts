import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';

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

    saveClient(client:ClientConfig): Promise<void> {
      let editedClient = {
        'name': client.name,
        'url': client.url,
        'method': client.method,
        'interval': client.interval
      }

      return this.http.put(`${this.clientConfigUrl}/${client.id}`, editedClient, { headers: this.jsonHeaders()})
      .toPromise()
      .then((res:any) => {
        return res.json();
      }).catch((err:any) => { console.log(err); });
    }


    createNewClient(client:ClientConfig): Promise<void> {
      let newClient = {
        'name': client.name,
        'tokens': [],
        'url': client.url,
        'method': client.method,
        'interval': client.interval
      }

      return this.http.post(this.clientConfigUrl, newClient, { headers: this.jsonHeaders()})
      .toPromise()
      .then((res:any) => {
        return res.json();
      }).catch((err:any) => { console.log(err); });

    }

    testClient(client:ClientConfig): Promise<any> {
      // TODO - Make configurable for different request methods
      return this.http.get(client.url)
      .toPromise()
      .then((res:any) => {
        return res.json();
      }).catch((err:any) => { console.log(err); });
    }

    private jsonHeaders(): Headers {
      return new Headers({
        'Content-Type'   : 'application/json'
      });
    }
}