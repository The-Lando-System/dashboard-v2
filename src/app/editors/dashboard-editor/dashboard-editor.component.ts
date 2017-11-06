import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DashboardService, Dashboard } from '../../services/dashboard.service';

@Component({
  moduleId: module.id,
  selector: 'dashboard-editor',
  templateUrl: 'dashboard-editor.component.html',
  styleUrls: [ 'dashboard-editor.component.css' ],
  providers: []
})
export class DashboardEditorComponent implements OnInit {

  private dashboard: Dashboard;

  constructor(
    private dashboardSvc: DashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.activatedRoute.params.forEach((params: Params) => {
      let dashboardId = params['dashboardId'];
      this.dashboardSvc.getDashboardById(dashboardId)
      .then((dashboard:Dashboard) => {
        this.dashboard = dashboard;
      }).catch((err:any) => {
        this.router.navigate(['/']);
      });
    });
  }

  saveDashboard(): void {
    this.dashboardSvc.editDashboard(this.dashboard).then(() => {});
  }

  deleteDashboard(): void {
    if (!confirm('Are you sure you want to delete this dashboard?')){
      return;
    }
    this.dashboardSvc.deleteDashboard(this.dashboard)
    .then(() => {
      console.log('Dashboard Deleted!');
      this.router.navigate(['/']);
    });
  }

}