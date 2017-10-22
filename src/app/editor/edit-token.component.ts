import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

import { ClientConfigService } from '../services/client-config.service';
import { ClientConfig, Token } from '../client/client-config';

@Component({
  moduleId: module.id,
  selector: 'edit-token',
  templateUrl: 'edit-token.component.html',
  styleUrls: [ 'edit-token.component.css' ],
  providers: []
})
export class EditTokenComponent implements OnInit {

  @Input() client: ClientConfig;
  @Input() token: Token;

  private parseRulesStr: string;

  constructor(
    private clientConfigService: ClientConfigService
  ){}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.token && this.token.parse_rules) {
      this.parseRulesStr = this.token.parse_rules.reduce(function(acc,rule){
        return `${acc},${rule}`;
      });
    }
  }

  setParseRules(): void {
    this.token.parse_rules = this.parseRulesStr.split(',');
  }

  saveToken(): void {

    this.setParseRules();

    if (this.token.isNew) {
      this.clientConfigService.addTokenToClient(this.token, this.client)
      .then((res:any) => {
        this.token.isNew = false;
        this.closeModal();
      });
    } else {
      this.clientConfigService.updateTokenInClient(this.token, this.client)
      .then((res:any) => {
        this.token.isNew = false;
        this.closeModal();
      });
    }

  }

  closeModal(): void {
    document.getElementById("closeTokenEditorButton").click();
    document.getElementById("refresh-client").click();
  }

}