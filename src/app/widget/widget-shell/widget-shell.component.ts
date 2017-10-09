import { Component, OnInit, Input } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

import { Globals } from '../../globals';

@Component({
  moduleId: module.id,
  selector: 'widget-shell',
  templateUrl: 'widget-shell.component.html',
  styleUrls: [ 'widget-shell.component.css' ]
})
export class WidgetShellComponent implements OnInit {

  @Input() title;
  @Input() id;

  private user: User;

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
    }).catch(err => {});
  }
  
  private listenForLogin(): void {
    this.broadcaster.on<string>(this.userSvc.LOGIN_BCAST)
    .subscribe(message => {
      this.initUser();
    });
  }

}