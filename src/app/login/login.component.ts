import { Component, OnInit } from '@angular/core';

import { AuthService, User } from '../services/auth.service';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ],
  providers: []
})
export class LoginComponent implements OnInit {

  private user: User;

  constructor(
    private authSvc: AuthService
  ) {}

  ngOnInit() {}

  login() {
    event.preventDefault();
    this.authSvc.login()
    .then((user:any) => {
      console.log('Login Successful!');
      console.log(user);
      this.user = user;
    }).catch((err:any) => {
      console.log('Login Failed!');
    })
  }

  logout() {
    this.authSvc.logout();
  }
}