import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService, AppGlobals } from 'angular2-google-login';
import { GoogleService } from '../services/google.service';

@Component({
  selector: module.id,
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  
  imageURL: string;
  email: string;
  name: string;
  token: string;

  constructor(
    private auth: AuthService,
    private zone: NgZone,
    private googleSvc: GoogleService
  ) {}

  /**
   * Ininitalizing Google Authentication API and getting data from localstorage if logged in
   */
  ngOnInit() {
    this.googleSvc.getClientId()
    .then((id:string) => {
      //Set your Google Client ID here
      AppGlobals.GOOGLE_CLIENT_ID = id;
      this.getData();
      setTimeout(() => { this.googleAuthenticate() }, 50);
    });
  }

  /**
   * Calling Google Authentication service
   */
  googleAuthenticate() {
    this.auth.authenticateUser((result) => {
      //Using Angular2 Zone dependency to manage the scope of variables
      this.zone.run(() => {
        this.getData();
      });
    });
  }

  /**
   * Getting data from browser's local storage
   */
  getData() {
    this.token = localStorage.getItem('token');
    this.imageURL = localStorage.getItem('image');
    this.name = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
  }

  /**
   * Logout user and calls function to clear the localstorage
   */
  logout() {
    let scopeReference = this;
    this.auth.userLogout(function () {
      scopeReference.clearLocalStorage();
    });
  }

  /**
   * Clearing Localstorage of browser
   */
  clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('image');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  }
}