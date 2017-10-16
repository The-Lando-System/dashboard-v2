import { Component, OnInit } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

import { ClientConfigService } from '../services/client-config.service';
import { ClientConfig, Token, Oauth2Config, ClientHeader } from '../client/client-config';

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
  private testResponse: string;
  private activeTab: string = 'client';
  private editingToken: Token;
  private authMethods: string[] = ['None','OAuth2'];
  private selectedAuthMethod: string;

  constructor(
    private broadcaster: Broadcaster,
    private clientConfigService: ClientConfigService
  ){}

  ngOnInit(): void {
    this.initNewClient();
    this.initClientList();
  }

  setActiveTab(tab:string): void {
    event.preventDefault();
    this.activeTab = tab;
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
      this.testResponse = '';
    }
    else {
      this.initNewClient();
    }
  }
  
  initNewClient(): void {
    this.editingClient = new ClientConfig();
    this.editingClient.name = 'New Client';
    this.testResponse = '';
    this.selectedAuthMethod = null;
  }

  setRequestMethod(requestMethod:string): void {
    event.preventDefault();
    this.editingClient.method = requestMethod;
  }

  testClient(): void {
    this.clientConfigService.testClient(this.editingClient)
    .then((res:any) => {
      this.testResponse = JSON.stringify(res, null, 2);
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
    console.log('Refresh called');
  }
}