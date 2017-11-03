import { Component, OnInit } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';
import { DashboardService, Dashboard } from '../services/dashboard.service';

import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: []
})
export class HomeComponent implements OnInit {

  private dashboards: Dashboard[] = [];

  constructor(
    private dashboardSvc: DashboardService,
    private broadcaster: Broadcaster,
    private router: Router
  ){}

  ngOnInit(): void {
    this.dashboardSvc.getDashboards()
    .then((dashboards:Dashboard[]) => {
      this.dashboards = dashboards;
      this.broadcaster.broadcast('DASHBOARD_SELECTED', '');
    });
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