import { Component, OnInit } from '@angular/core';

import { UserService, User, Broadcaster } from 'sarlacc-angular-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private user: User;
  
  constructor(
    private userSvc: UserService,
    private broadcaster: Broadcaster
  ){}

  ngOnInit() {
    this.initUser();
    this.listenForLogin();
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

}
