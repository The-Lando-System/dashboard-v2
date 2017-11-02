import { Component, OnInit } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DashboardService, Dashboard } from '../services/dashboard.service';

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: [ 'dashboard.component.css' ],
  providers: []
})
export class DashboardComponent implements OnInit {

  private dashboard: Dashboard;

  constructor(
    private broadcaster: Broadcaster,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dashboardSvc: DashboardService
  ){}

  ngOnInit(): void {
    this.activatedRoute.params.forEach((params: Params) => {
      let dashboardId = params['dashboardId'];
      if (dashboardId) {
        this.dashboardSvc.getDashboardById(dashboardId)
        .then((dashboard:Dashboard) => {
          this.dashboard = dashboard;
        }).catch((err:any) => {
          this.router.navigate(['/']);
        });
      }
    });
  }

}