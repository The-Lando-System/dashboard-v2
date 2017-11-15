import { Injectable, OnInit } from '@angular/core';
import { Broadcaster } from './broadcaster';
import { AuthService } from './auth.service';
import { RequestService } from './request.service';
import { NotificationService } from './notification.service';
import { Globals } from '../globals';

@Injectable()
export class ClientConfigService implements OnInit {

    private clientConfigUrl = Globals.SVC_DOMAIN + '/client';

    private clientConfigs:ClientConfig[] = [];

    constructor(
        private broadcaster: Broadcaster,
        private authSvc: AuthService,
        private requestSvc: RequestService,
        private notificationSvc: NotificationService
    ) {}

    ngOnInit(): void {}

    retrieveClientConfigs(): Promise<ClientConfig[]> {
      return new Promise<ClientConfig[]>((resolve,reject) => {
        this.requestSvc.get(this.clientConfigUrl, this.authSvc.createAuthHeaders())
        .then((clientConfigs:ClientConfig[]) => {
          this.clientConfigs = clientConfigs;
          resolve(this.clientConfigs);
        }).catch((err:Response) => {
          this.notificationSvc.fail('Failed to retrieve client configs!');
          reject();
        });
      });
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
        'interval': client.interval,
        'oauth2_config': client.oauth2_config ? client.oauth2_config : {}
      }

      return this.updateClient(editedClient,client.id);
    }

    updateClient(editedClient:any, clientId:string): Promise<ClientConfig> {
      return new Promise<ClientConfig>((resolve,reject) => {
        this.requestSvc.put(`${this.clientConfigUrl}/${clientId}`, editedClient, this.authSvc.createAuthHeaders())
        .then((clientConfig:ClientConfig) => {
          this.notificationSvc.success('Successfully updated client!');
          resolve(clientConfig);
        }).catch((err:string) => {
          this.notificationSvc.fail('Failed to update client!');
          reject();
        });
      });
    }

    createNewClient(client:ClientConfig): Promise<ClientConfig> {
      let newClient = {
        'name': client.name,
        'tokens': [],
        'url': client.url,
        'method': client.method,
        'interval': client.interval,
        'oauth2_config': client.oauth2_config ? client.oauth2_config : {}
      }

      return new Promise<ClientConfig>((resolve,reject) => {
        this.requestSvc.post(this.clientConfigUrl, newClient, this.authSvc.createAuthHeaders())
        .then((clientConfig:ClientConfig) => {
          this.notificationSvc.success('Successfully created new client!');
          resolve(clientConfig);
        }).catch((err:string) => {
          this.notificationSvc.fail('Failed to create new client!');
          reject();
        });
      });
    }

    deleteClient(client:ClientConfig): Promise<void> {
      return new Promise<void>((resolve,reject) => {
        this.requestSvc.delete(`${this.clientConfigUrl}/${client.id}`,this.authSvc.createAuthHeaders())
        .then(() => {
          this.notificationSvc.success('Successfully deleted client!');
          resolve();
        }).catch((err:string) => {
          this.notificationSvc.fail('Failed to delete client!');
          reject();
        });
      });
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
        'method':client.method,
        'oauth2_config':client.oauth2_config ? client.oauth2_config : ''
      }

      return new Promise<any>((resolve,reject) => {
        this.requestSvc.post(`${this.clientConfigUrl}/test`,requestTest,this.authSvc.createAuthHeaders())
        .then((response:any) => {
          let res;
          try {
            res = JSON.parse(response);
            this.notificationSvc.success('Client test was successful!');
            resolve(res);
          } catch(e) {
            res = {
              'error' : 'Response was not in a valid JSON format',
              'response' : response
            };
            this.notificationSvc.fail('Client test failed!');
            reject(res);
          }
        }).catch((err:string) => {
          this.notificationSvc.fail('Client test failed!');
          reject(err);
        });
      });
    }

    activateClients(): Promise<void> {
      return new Promise<void>((resolve,reject) => {
        this.requestSvc.post(`${this.clientConfigUrl}/restart-clients`, {}, this.authSvc.createAuthHeaders())
        .then(() => {
          this.broadcaster.broadcast('REFRESH_COMPLETE',true);
          resolve();
        }).catch((err:string) => {
          this.notificationSvc.fail('Failed to restart clients!');
          reject();
        });
      });
    }

}

export class ClientConfig {
  id: string;
  name: string;
  tokens: Token[];
  url: string;
  headers: ClientHeader[];
  method: string;
  interval: number;
  oauth2_config: Oauth2Config;
}

export class Oauth2Config {
  api_key: string;
  api_secret: string;
  auth_url: string;
  auth_headers: ClientHeader[];
}

export class ClientHeader {
  key: string;
  value: string;

  constructor(key:string,value:string){
    this.key = key;
    this.value = value;
  }
}

export class Token {
    name: string;
    parse_rules: string[];
    isNew: boolean;
}