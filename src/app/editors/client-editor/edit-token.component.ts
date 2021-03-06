import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Broadcaster } from '../../services/broadcaster';

import { ClientConfigService, ClientConfig, Token } from '../../services/client-config.service';

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