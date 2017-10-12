import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { UserService, Broadcaster } from 'sarlacc-angular-client';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { WidgetShellComponent } from './widget/widget-shell/widget-shell.component';
import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';

import { LoadingBarComponent } from './loading-bar/loading-bar.component';

import { OrchestratorService } from './services/orchestrator.service';
import { TokenReplacer } from './services/token-replacer';
import { WidgetTemplateService } from './services/widget-template.service';
import { ClientConfigService } from './services/client-config.service';

import { Globals } from './globals';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuComponent,
    WidgetShellComponent,
    HomeComponent,
    EditorComponent,
    LoadingBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
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
      }
    ])
  ],
  providers: [
    Globals,
    Broadcaster,
    UserService,
    CookieService,
    OrchestratorService,
    TokenReplacer,
    WidgetTemplateService,
    ClientConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
