import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '../services/broadcaster';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { User, AuthService } from '../services/auth.service';

import { DashboardService, Dashboard } from '../services/dashboard.service';

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
  private dashboard: Dashboard;

  constructor(
    private broadcaster: Broadcaster,
    private authSvc: AuthService,
    private dashboardSvc: DashboardService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.listenForRefreshComplete();
    this.user = this.authSvc.getUser();
    this.listenForDashboard();
    this.listenForLogin();
  }

  login(): void {
    event.preventDefault();
    this.toggleMenu();
    this.authSvc.login()
    .then(() => {
      this.user = this.authSvc.getUser();
    })
  }

  logout(): void {
    event.preventDefault();
    this.authSvc.logout();
    this.toggleMenu();
  }

  toggleMenu(): void {
    event.preventDefault();
    this.menuState = this.menuState === 'in' ? 'out' : 'in';
  }

  restartClients(): void {
    this.refreshing = true;
    this.broadcaster.broadcast('RESTART_CLIENTS',true);
  }

  listenForLogin(): void {
    this.broadcaster.on('USER_LOGIN').subscribe(() => {
      this.user = this.authSvc.getUser();
    });
  }

  listenForRefreshComplete(): void {
    this.broadcaster.on('REFRESH_COMPLETE').subscribe((res:any) => {
      setTimeout(this.stopRefresh.bind(this), 1000);
    });
  }

  listenForDashboard(): void {
    this.broadcaster.on('DASHBOARD_SELECTED').subscribe((dashboardId:string) => {
      if (!dashboardId) {
        this.dashboard = null;
      } else {
        this.dashboardSvc.getDashboardById(dashboardId)
        .then((dashboard:Dashboard) => {
          this.dashboard = dashboard;
        }).catch((err:any) => {
          this.dashboard = null;
        });
      }
    });
  }

  deleteDashboard(): void {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this dashboard?')) {
      this.dashboardSvc.deleteDashboard(this.dashboard)
      .then((res:any) => {
        this.router.navigate(['/']);
        this.toggleMenu();
      });
    }
  }

  private stopRefresh(): void {
    this.refreshing = false;
  }

}