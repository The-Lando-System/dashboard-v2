import { Component, OnInit } from '@angular/core';
import { DashboardService, Dashboard } from '../services/dashboard.service';

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
    private dashboardSvc: DashboardService
  ){}

  ngOnInit(): void {
    this.dashboardSvc.getDashboards()
    .then((dashboards:Dashboard[]) => {
      this.dashboards = dashboards;
    });
  }

}