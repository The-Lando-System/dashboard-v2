import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService, Broadcaster } from 'sarlacc-angular-client';
import { AuthService } from 'angular2-google-login';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { WidgetShellComponent } from './widget/widget-shell/widget-shell.component';
import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';
import { ClientEditorComponent } from './editor/client-editor.component';
import { EditTokenComponent } from './editor/edit-token.component';

import { LoadingBarComponent } from './loading-bar/loading-bar.component';

import { OrchestratorService } from './services/orchestrator.service';
import { TokenService } from './services/token.service';
import { WidgetTemplateService } from './services/widget-template.service';
import { ClientConfigService } from './services/client-config.service';
import { GoogleService } from './services/google.service';

import { Globals } from './globals';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuComponent,
    WidgetShellComponent,
    HomeComponent,
    EditorComponent,
    LoadingBarComponent,
    ClientEditorComponent,
    EditTokenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'editor/:widgetId',
        component: EditorComponent
      },
      {
        path: 'client-editor',
        component: ClientEditorComponent
      }
    ])
  ],
  providers: [
    Globals,
    Broadcaster,
    UserService,
    CookieService,
    OrchestratorService,
    TokenService,
    WidgetTemplateService,
    ClientConfigService,
    AuthService,
    GoogleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
