import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { AuthService } from './auth.service';

import { Globals } from '../globals';

@Injectable()
export class DashboardService implements OnInit {

    private dashboardUrl = Globals.SVC_DOMAIN + '/dashboard';

    private dashboards:Dashboard[] = [];

    constructor(
        private http: Http,
        private authSvc: AuthService
    ) {}

    ngOnInit(): void {}

    getDashboards(): Promise<Dashboard[]> {
      return this.http.get(this.dashboardUrl, {headers:this.authSvc.createAuthHeaders()})
      .toPromise()
      .then((res:any) => {
        return res.json();
      }).catch((err:any) => { console.log(err); return null; });
    }

    getDashboardById(id:string): Promise<Dashboard> {
      return this.getDashboards()
      .then((dashboards:Dashboard[]) => {
        for (let dashboard of dashboards) {
          if (dashboard.id === id)
            return dashboard;
        }
        return null;
      });
    }

    updateDashboardName(name:string, dashboardId:string): Promise<void> {

      let dashboardUpdate = {
        'name': name
      };

      return this.updateDashboard(dashboardUpdate,dashboardId);
    }

    createDashboard(dashboard:Dashboard): Promise<Dashboard> {

      let newDashboard = {
        'userId': dashboard.userId,
        'name': dashboard.name,
        'widgetIds': dashboard.widgetIds
      };

      return this.http.post(this.dashboardUrl, newDashboard, {headers:this.authSvc.createAuthHeaders()})
      .toPromise()
      .then((res:any) => {
        return res.json();
      }).catch((err:any) => { console.log(err); });
    }

    deleteDashboard(dashboard:Dashboard): Promise<void> {
      return this.http.delete(`${this.dashboardUrl}/${dashboard.id}`, {headers:this.authSvc.createAuthHeaders()})
      .toPromise()
      .then((res:any) => {}).catch((err:any) => { console.log(err) });
    }

    addWidgetToDashboard(widgetId:string, dashboard:Dashboard): Promise<void> {
      
      dashboard.widgetIds.push(widgetId);

      let dashboardUpdate = {
        'widgetIds': dashboard.widgetIds
      };

      return this.updateDashboard(dashboardUpdate,dashboard.id);
    }

    removeWidgetFromDashboard(widgetId:string, dashboard:Dashboard): Promise<void> {

      let deleteIndex = -1;
      for (let i = 0; i<dashboard.widgetIds.length; i++) {
        if (dashboard.widgetIds[i] === widgetId) {
          deleteIndex = i;
          break;
        }
      }

      if (deleteIndex === -1) {
        console.log(`Failed to remove widget with id [${widgetId}]`);
        return null;
      }

      dashboard.widgetIds.splice(deleteIndex, 1);

      let dashboardUpdate = {
        'widgetIds': dashboard.widgetIds
      };

      return this.updateDashboard(dashboardUpdate,dashboard.id);

    }

    editDashboard(dashboard:Dashboard): Promise<void> {
      
      let dashboardUpdate = {
        'name': dashboard.name,
        'previewImage': dashboard.previewImage,
        'backgroundImage': dashboard.backgroundImage,
        'isPrimary': dashboard.isPrimary
      };

      return this.updateDashboard(dashboardUpdate, dashboard.id);

    }

    private updateDashboard(dashboardUpdate:any, dashboardId:string): Promise<void> {
      return this.http.put(`${this.dashboardUrl}/${dashboardId}`, dashboardUpdate, {headers:this.authSvc.createAuthHeaders()})
      .toPromise()
      .then((res:any) => {}).catch((err:any) => { console.log(err) });
    }

}

export class Dashboard {
  id: string;
  userId: string;
  name: string;
  previewImage: string;
  isPrimary: boolean;
  backgroundImage: string;
  widgetIds: string[];
}