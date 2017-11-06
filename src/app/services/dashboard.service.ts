import { Injectable, OnInit } from '@angular/core';
import { Headers } from '@angular/http';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { RequestService } from './request.service';
import { Globals } from '../globals';

@Injectable()
export class DashboardService implements OnInit {

    private dashboardUrl = Globals.SVC_DOMAIN + '/dashboard';

    private dashboards:Dashboard[] = [];

    constructor(
        private authSvc: AuthService,
        private notificationSvc: NotificationService,
        private requestService: RequestService
    ) {}

    ngOnInit(): void {}

    getDashboards(): Promise<Dashboard[]> {
      return new Promise<Dashboard[]>((resolve,reject) => {
        this.requestService.get(this.dashboardUrl, this.authSvc.createAuthHeaders())
        .then((dashboards:Dashboard[]) => {
          resolve(dashboards);
        }).catch((error:string) => {
          this.notificationSvc.fail(error);
          reject();
        });
      }); 
    }

    getDashboardById(id:string): Promise<Dashboard> {
      return new Promise<Dashboard>((resolve,reject) => {
        this.getDashboards()
        .then((dashboards:Dashboard[]) => {
          for (let dashboard of dashboards) {
            if (dashboard.id === id) {
              resolve(dashboard);
              return;
            }
          }
          this.notificationSvc.fail(`Could not find dashboard with ID [${id}]`);
          reject();
        }).catch((error:string) => {
          this.notificationSvc.fail(error);
          reject();
        });
      });
    }

    createDashboard(dashboard:Dashboard): Promise<Dashboard> {

      let newDashboard = {
        'userId': dashboard.userId,
        'name': dashboard.name,
        'widgetIds': dashboard.widgetIds
      };

      return new Promise<Dashboard>((resolve,reject) => {
        this.requestService.post(this.dashboardUrl, newDashboard, this.authSvc.createAuthHeaders())
        .then((dashboard:Dashboard) => {
          this.notificationSvc.success('Successfully created new dashboard!');
          resolve(dashboard);
        }).catch((error:string) => {
          this.notificationSvc.fail(error);
          reject();
        });
      });
    }

    deleteDashboard(dashboard:Dashboard): Promise<void> {
      return new Promise<void>((resolve,reject) => {
        this.requestService.delete(`${this.dashboardUrl}/${dashboard.id}`, this.authSvc.createAuthHeaders())
        .then((dashboard:Dashboard) => {
          this.notificationSvc.success('Successfully deleted dashboard!');
          resolve();
        }).catch((error:string) => {
          this.notificationSvc.fail(error);
          reject();
        });
      });
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
      return new Promise<void>((resolve,reject) => {
        this.requestService.put(`${this.dashboardUrl}/${dashboardId}`, dashboardUpdate, this.authSvc.createAuthHeaders())
        .then((dashboard:Dashboard) => {
          this.notificationSvc.success('Successfully updated dashboard!');
          resolve();
        }).catch((error:string) => {
          this.notificationSvc.fail('Failed to update dashboard!');
          reject();
        });
      });
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