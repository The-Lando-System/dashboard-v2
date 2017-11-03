import { Component, OnInit } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { User, AuthService } from '../services/auth.service';

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

  private menuState: string = 'in';
  private refreshing: boolean;
  private user: User;
  private dashboardId: string;

  constructor(
    private broadcaster: Broadcaster,
    private authSvc: AuthService
  ){}

  ngOnInit(): void {
    this.listenForRefreshComplete();
    this.user = this.authSvc.getUser();
    this.listenForDashboard();
  }

  login(): void {
    event.preventDefault();
    this.toggleMenu();
    this.authSvc.login()
    .then((user:User) => {
      this.user = user;
    })
  }

  logout(): void {
    event.preventDefault();
    this.authSvc.logout();
    this.toggleMenu();
  }

  refreshLogin(): void {
    event.preventDefault();
    this.authSvc.refreshLogin();
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

  listenForDashboard(): void {
    this.broadcaster.on('DASHBOARD_SELECTED').subscribe((dashboardId:string) => {
      this.dashboardId = dashboardId;
    });
  }

  private stopRefresh(): void {
    this.refreshing = false;
  }

}