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

    saveClient(client:ClientConfig): Promise<ClientConfig> {
      let editedClient = {
        'name': client.name,
        'url': client.url,
        'method': client.method,
        'interval': client.interval
      }

      return this.updateClient(editedClient,client.id);
    }

    updateClient(editedClient:any, clientId:string): Promise<ClientConfig> {
      return this.http.put(`${this.clientConfigUrl}/${clientId}`, editedClient, { headers: this.jsonHeaders()})
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

    deleteClient(client:ClientConfig): Promise<void> {
      return this.http.delete(`${this.clientConfigUrl}/${client.id}`)
      .toPromise()
      .then((res:any) => {
        return res.json();
      }).catch((err:any) => { console.log(err); });
    }

    addTokenToClient(token:Token, client:ClientConfig): Promise<ClientConfig> {
      
      client.tokens.push(token);
      
      let editedClient = {
        "tokens": client.tokens
      };

      return this.updateClient(editedClient,client.id);
    }

    updateTokenInClient(token:Token, client:ClientConfig): Promise<ClientConfig> {
      client.tokens.forEach(t => {
        if (token.name === t.name) {
          t = token;
        }
      });

      let editedClient = {
        "tokens": client.tokens
      };

      return this.updateClient(editedClient,client.id);
    }

    removeTokenFromClient(token:Token, client:ClientConfig): Promise<ClientConfig> {
      
      let deleteIndex = -1;
      for (let i = 0; i<client.tokens.length; i++) {
        if (client.tokens[i].name === token.name) {
          deleteIndex = i;
          break;
        }
      }

      if (deleteIndex === -1) {
        console.log(`Failed to remove token with name ${token.name}!`);
        return null;
      }

      client.tokens.splice(deleteIndex, 1);

      let editedClient = {
        'tokens': client.tokens,
      };

      return this.updateClient(editedClient,client.id);
    }

    testClient(client:ClientConfig): Promise<any> {
    
      let requestTest = {
        'url':client.url,
        'method':client.method
      }

      return this.http.post(`${this.clientConfigUrl}/test`,requestTest,{ headers: this.jsonHeaders()})
      .toPromise()
      .then((res:any) => {
        let response;
        try {
          response = JSON.parse(res.json());
        } catch(e) {
          response = {
            'error' : 'Response was not in a valid JSON format',
            'response' : res._body
          };
        }
        return response;
      }).catch((err:any) => {
        let error;
        try {
          error = {
            'error' : 'An error occured during the client request',
            'details' : err._body
          };
        } catch(e) {
          error = {
            'error' : 'An error occured during the client request',
            'details' : err
          };
        }
        console.log(error); 
        return error;
      });
    }

    private jsonHeaders(): Headers {
      return new Headers({
        'Content-Type'   : 'application/json'
      });
    }
}