import { Component, OnInit } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';
import { DashboardService, Dashboard } from '../services/dashboard.service';
import { AuthService, User } from '../services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: []
})
export class HomeComponent implements OnInit {

  private user: User;
  private dashboards: Dashboard[] = [];
  private selectedDashboard: Dashboard;

  constructor(
    private dashboardSvc: DashboardService,
    private broadcaster: Broadcaster,
    private router: Router,
    private authSvc: AuthService
  ){}

  ngOnInit(): void {
    this.user = this.authSvc.getUser();
    if (this.user) {
      this.dashboardSvc.getDashboards()
      .then((dashboards:Dashboard[]) => {
        this.dashboards = dashboards;
        if (this.dashboards[0]) {
          this.selectedDashboard = dashboards[0];
        }
        this.broadcaster.broadcast('DASHBOARD_SELECTED', '');
      });
    }
  }

  login(): void {
    this.authSvc.login()
    .then((user:User) => {
      this.user = user;
      this.dashboardSvc.getDashboards()
      .then((dashboards:Dashboard[]) => {
        this.dashboards = dashboards;
        if (this.dashboards[0]) {
          this.selectedDashboard = dashboards[0];
        }
        this.broadcaster.broadcast('DASHBOARD_SELECTED', '');
      });
    });
  }

  selectDashboard(dashboard:Dashboard): void {
    this.selectedDashboard = dashboard;
  }

  createDashboard(): void {

    let newDashboard:Dashboard = new Dashboard();

    newDashboard.name = 'New Dashboard';

    this.dashboardSvc.createDashboard(newDashboard)
    .then((dashboard:Dashboard) => {
      this.router.navigate(['/dashboard',dashboard.id]);
    });
  }

}