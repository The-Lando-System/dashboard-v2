import { Component, OnInit } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

import { Globals } from '../globals';

@Component({
  moduleId: module.id,
  selector: 'side-menu',
  templateUrl: 'side-menu.component.html',
  styleUrls: [ 'side-menu.component.css' ]
})
export class SideMenuComponent implements OnInit {

  private user: User;
  private sarlaccUrl: string;

  constructor(
    private globals: Globals,
    private userSvc: UserService,
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.initUser();
    this.listenForLogin();
  }

  private initUser() {
    this.userSvc.returnUser()
    .then((user:User) => {
      this.user = user;
      this.sarlaccUrl = `${this.globals.sarlacc_domain}/token/${this.user.token.access_token}`;
    }).catch(err => {});
  }
  
  private listenForLogin(): void {
    this.broadcaster.on<string>(this.userSvc.LOGIN_BCAST)
    .subscribe(message => {
      this.initUser();
    });
  }

}