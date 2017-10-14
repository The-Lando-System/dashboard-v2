import { Component, OnInit } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

import { ClientConfigService } from '../services/client-config.service';
import { ClientConfig, Token } from '../client/client-config';

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

  constructor(
    private broadcaster: Broadcaster,
    private clientConfigService: ClientConfigService
  ){}

  ngOnInit(): void {
    this.editingClient.name = 'New Client';
    this.initClientList();
  }

  initClientList(): void {
    this.clientConfigService.retrieveClientConfigs()
    .then((clients:ClientConfig[]) => {
      this.clients = clients;
    });
  }

  selectClientForEdit(client:ClientConfig): void {
    event.preventDefault();
    if (client) {
      this.editingClient = client;
    }
    else {
      this.editingClient = new ClientConfig();
      this.editingClient.name = 'New Client';
      this.testResponse = '';
    }
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
}