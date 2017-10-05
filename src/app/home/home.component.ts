import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


import { UserService, User, Broadcaster } from 'sarlacc-angular-client';
import { Widget, WidgetToken } from '../widget/widget';
import { Endpoint, RequestMethod } from '../widget/api-client'; 

import { TokenProcessor } from '../widget/services/token-processor';
import { ApiInvoker } from '../widget/services/api-invoker';
import { JsonPathParser } from '../widget/services/json-path-parser';

import { Globals } from '../globals';

declare var io: any;

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.css' ],
  providers: [TokenProcessor,ApiInvoker,JsonPathParser]
})
export class HomeComponent implements OnInit {

  socket: any;

  private user: User;
  private widgets: Widget[] = [];

  constructor(
    private globals: Globals,
    private userSvc: UserService,
    private broadcaster: Broadcaster,
    private tokenProcessor: TokenProcessor,
    private sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
    this.initUser();
    this.listenForLogin();
    this.connect();
  }

  connect(): void {
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', function() {
      console.log('Connected');
      
    });

    this.socket.on('value', function(data) {
      console.log(data);
    });
  }

  private initUser() {
    this.userSvc.returnUser()
    .then((user:User) => {
      this.user = user;
    }).catch(err => {});
  }
  
  private listenForLogin(): void {
    this.broadcaster.on<string>(this.userSvc.LOGIN_BCAST)
    .subscribe(message => {
      this.initUser();
    });
  }

  sanitizeHtml(html:string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // TEST METHODS

  private createTestWidgets(): Promise<Widget[]> {
    let widgets: Widget[] = [];

    let widget1 = new Widget();
    widget1.name = 'Widget 1';
    widget1.js =
    'var xhttp = new XMLHttpRequest();' +
    'xhttp.onreadystatechange = function() {' +
     'if (this.readyState == 4 && this.status == 200) {' +
        'document.getElementById(\'test\').innerHTML = ' +
        'this.responseText;' +
      '}' +
    '};' +
    'var parm = document.getElementById(\'test-input\').value;' +
    'xhttp.open(\'GET\', \'http://httpbin.org/\' + parm, true);' +
    'xhttp.send();';

    widget1.html = 
      '<input id="test-input" class="form-control"><br/>' +
      '<button id="test-btn" type="button" class="btn btn-primary" onclick="' + widget1.js + '">' +
      'Click Me</button><br/><br/>' +
      '<h4 id="test">Response from google places call: [${GOOGLE_PLACES}]</h4>';
    widget1.tokens = this.createTokens();

    console.log(JSON.stringify(widget1,null,2));

    return this.tokenProcessor.processTokens(widget1)
    .then((newHtml:string) => {
      widget1.html = newHtml;
      widgets.push(widget1);
      return widgets; 
    }).catch((err:any) => {
      return widgets;
    });
  }

  private createTokens(): WidgetToken[] {
    let tokens: WidgetToken[] = [];

    let token1: WidgetToken = new WidgetToken();
    token1.endpoint = this.createTestEndpoint();
    token1.name = 'GOOGLE_PLACES';
    token1.responseParseRules = ['@results','#1','@name'];
    tokens.push(token1);

    return tokens;
  }

  private createTestEndpoint(): Endpoint {
    let endpoint :Endpoint = new Endpoint();
    endpoint.url = 'http://localhost:3002/google/places/query/38.8339,-104.8214/50000/italian';
    endpoint.method = RequestMethod.GET;
    return endpoint;
  }

}