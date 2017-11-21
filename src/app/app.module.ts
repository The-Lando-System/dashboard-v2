import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatIconModule, MatFormFieldModule, MatGridListModule, MatListModule } from '@angular/material';

import { AppComponent } from './app.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { HomeComponent } from './home/home.component';
import { WidgetEditorComponent } from './editors/widget-editor/widget-editor.component';
import { ClientEditorComponent } from './editors/client-editor/client-editor.component';
import { DashboardEditorComponent } from './editors/dashboard-editor/dashboard-editor.component';
import { EditTokenComponent } from './editors/client-editor/edit-token.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NotificationComponent } from './notification/notification.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';

import { Broadcaster } from './services/broadcaster';
import { OrchestratorService } from './services/orchestrator.service';
import { TokenService } from './services/token.service';
import { WidgetTemplateService } from './services/widget-template.service';
import { ClientConfigService } from './services/client-config.service';
import { AuthService } from './services/auth.service';
import { DashboardService } from './services/dashboard.service';
import { NotificationService } from './services/notification.service';
import { RequestService } from './services/request.service';

import { StartupService } from './services/startup.service';

export function startupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    HomeComponent,
    WidgetEditorComponent,
    LoadingBarComponent,
    ClientEditorComponent,
    EditTokenComponent,
    DashboardComponent,
    DashboardEditorComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatGridListModule,
    MatListModule,
    MatCardModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'widget-editor/:dashboardId/:widgetId',
        component: WidgetEditorComponent
      },
      {
        path: 'client-editor',
        component: ClientEditorComponent
      },
      {
        path: 'dashboard/:dashboardId',
        component: DashboardComponent
      },
      {
        path: 'dashboard-editor/:dashboardId',
        component: DashboardEditorComponent
      }
    ])
  ],
  providers: [
    Broadcaster,
    CookieService,
    OrchestratorService,
    TokenService,
    WidgetTemplateService,
    ClientConfigService,
    AuthService,
    DashboardService,
    NotificationService,
    RequestService,
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [StartupService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
