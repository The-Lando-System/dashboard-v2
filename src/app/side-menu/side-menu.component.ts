import { Component, OnInit } from '@angular/core';
import { UserService, User, Broadcaster } from 'sarlacc-angular-client';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Globals } from '../globals';

@Component({
  moduleId: module.id,
  selector: 'side-menu',
  templateUrl: 'side-menu.component.html',
  styleUrls: [ 'side-menu.component.css' ],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(80%, 0, 0)'
      })),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out'))
    ]),
  ]
})
export class SideMenuComponent implements OnInit {

  private user: User;
  private menuState: string = 'in';
  private refreshing: boolean;

  constructor(
    private globals: Globals,
    private userSvc: UserService,
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.initUser();
    this.listenForLogin();
    this.listenForRefreshComplete();
  }

  toggleMenu(): void {
    event.preventDefault();
    this.menuState = this.menuState === 'in' ? 'out' : 'in';
  }

  restartClients(): void {
    this.refreshing = true;
    this.broadcaster.broadcast('RESTART_CLIENTS',true);
  }

  listenForRefreshComplete(): void {
    this.broadcaster.on('REFRESH_COMPLETE').subscribe((res:any) => {
      setTimeout(this.stopRefresh.bind(this), 1000);
    });
  }

  private stopRefresh(): void {
    this.refreshing = false;
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