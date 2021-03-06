import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Broadcaster } from '../../services/broadcaster';

import { TokenService } from '../../services/token.service';
import { ClientConfigService, ClientConfig, Token, Oauth2Config, ClientHeader } from '../../services/client-config.service';

@Component({
  moduleId: module.id,
  selector: 'client-editor',
  templateUrl: 'client-editor.component.html',
  styleUrls: [ 'client-editor.component.css' ],
  providers: []
})
export class ClientEditorComponent implements OnInit {
    
  private clients: ClientConfig[];
  private editingClient: ClientConfig = new ClientConfig();
  private requestMethods: string[] = ['GET','POST','PUT','DELETE'];
  private rawResponse: string;
  private activeTab: string = 'client';
  private activeResponseTab: string = 'raw';
  private editingToken: Token = new Token();
  private authMethods: string[] = ['None','OAuth2'];
  private selectedAuthMethod: string;
  private responseTokens: any[] = [];

  constructor(
    private broadcaster: Broadcaster,
    private clientConfigService: ClientConfigService,
    private sanitizer: DomSanitizer,
    private tokenService: TokenService
  ){}

  ngOnInit(): void {
    this.initNewClient();
    this.initClientList();
    this.broadcaster.broadcast('DASHBOARD_SELECTED', '');
  }

  setActiveTab(tab:string): void {
    event.preventDefault();
    this.activeTab = tab;
  }

  setActiveResponseTab(tab:string): void {
    event.preventDefault();
    this.activeResponseTab = tab;
  }

  setAuthMethod(authMethod:string): void {
    event.preventDefault();
    this.selectedAuthMethod = authMethod;
    if (this.selectedAuthMethod === 'OAuth2') {
      this.editingClient.oauth2_config = new Oauth2Config();
    } else {
      this.editingClient.oauth2_config = null;
    }
  }

  initClientList(): void {
    this.clientConfigService.retrieveClientConfigs()
    .then((clients:ClientConfig[]) => {
      this.clients = clients;
      this.initNewClient();
    });
  }

  selectClientForEdit(client:ClientConfig): void {
    event.preventDefault();

    this.activeTab = 'client';

    if (client) {
      this.editingClient = client;
      if (this.editingClient.oauth2_config){
        this.selectedAuthMethod = 'OAuth2';
      } else {
        this.selectedAuthMethod = 'None';
      }
      this.rawResponse = '';
      this.responseTokens = [];
    }
    else {
      this.initNewClient();
    }
  }
  
  initNewClient(): void {
    this.editingClient = new ClientConfig();
    this.editingClient.name = 'New Client';
    this.rawResponse = '';
    this.responseTokens = [];
    this.selectedAuthMethod = null;
  }

  createToken(token:any): void {
    this.editingToken = new Token();
    this.editingToken.name = '';
    this.editingToken.parse_rules = token ? token.location.split(',') : [''];
    this.editingToken.isNew = true;
    this.activeTab = 'tokens';
  }

  editToken(token:Token): void {
    this.editingToken = token;
    this.editingToken.isNew = false;
  }

  setRequestMethod(requestMethod:string): void {
    event.preventDefault();
    this.editingClient.method = requestMethod;
  }

  testClient(): void {
    this.clientConfigService.testClient(this.editingClient)
    .then((res:any) => {
      this.rawResponse = JSON.stringify(res, null, 2);
      
      this.responseTokens = [];

      this.tokenService.findAttrLocations(this.responseTokens, [], res);
    });
  }

  saveClient(): void {
    if (!this.editingClient.id) {
      this.clientConfigService.createNewClient(this.editingClient)
      .then((res:any) => {
        this.initClientList();
      });
    } else {
      this.clientConfigService.saveClient(this.editingClient)
      .then((res:any) => {
        this.initClientList();
      });
    }
  }

  deleteClient(): void {
    if (!this.editingClient.id)
      return;

    if (!confirm('Are you sure you want to delete this client?'))
      return;

    this.clientConfigService.deleteClient(this.editingClient)
    .then((res:any) => {
      this.initClientList();
    });
  }

  removeTokenFromClient(token:Token): void {
    this.clientConfigService.removeTokenFromClient(token, this.editingClient);
  }

  refreshClient(): void {
    this.editingToken = new Token();
  }

  selectToken(token): void {
    console.log('');
    console.log(token.item);
    console.log(token.isToken);
  }

  getPointerClass(responseToken): string {
    return responseToken.isToken ? 'clickable' : '';
  }

}