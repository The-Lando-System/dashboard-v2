import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Globals } from '../globals';

declare const gapi: any;

@Injectable()
export class AuthService {

  private user: User;
  private clientIdUrl = Globals.SVC_DOMAIN + '/google/client-id';
  private logoutUrl =
    'https://www.google.com/accounts/Logout' + 
    '?continue=https://appengine.google.com/_ah/logout?continue=' + Globals.THIS_DOMAIN;

  constructor(private http: Http){
    this.getClientId()
    .then((id) => {
      Globals.GOOGLE_CLIENT_ID = id;
      this.user = this.getUser();
      this.user.accessToken = this.getAccessToken();
      if (this.user) {
        this.refreshLogin()
        .then((access_token) => {
          this.user.accessToken = access_token;
          this.storeUserInfo();
        });
      }
      setInterval(() => {
        this.refreshLogin()
        .then((access_token) => {
          console.log('Updating the access token');
          this.user.accessToken = access_token;
          this.storeUserInfo();
        });
      }, 60000);
    });


  }

  login() {
    return new Promise<{}>((resolve, reject) => {

      // Make auth request
      gapi.load('auth2', () => {
        let auth2 = gapi.auth2.init({
          client_id: Globals.GOOGLE_CLIENT_ID,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        }).then(()=> {
          gapi.auth2.getAuthInstance().signIn();
        });

         // Listen for auth response
        gapi.auth2.getAuthInstance().currentUser.listen((userDetails) => {
          console.log(userDetails);
          let profile = userDetails.getBasicProfile();
          this.user = new User(
            profile.getName(),
            profile.getEmail(),
            profile.getImageUrl(),
            userDetails.getAuthResponse().access_token
          );
          this.storeUserInfo();
          resolve(this.user);
        });
      });
    });
  }

  logout(): void {
    this.clearUserInfo();
    document.location.href = this.logoutUrl;
  }

  refreshLogin(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      gapi.load('auth2', () => {
        let auth2 = gapi.auth2.init({
          client_id: Globals.GOOGLE_CLIENT_ID,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        }).then(()=> {
          gapi.auth2.getAuthInstance().currentUser.get()
          .reloadAuthResponse().then((authResponse) => {
            resolve(authResponse.access_token);
          });
        });
      });
    });
  }

  getUser(): User {
    return this.user ? this.user : JSON.parse(localStorage.getItem('currentUser'));
  }

  getAccessToken(): string {
    if (this.user && this.user.accessToken)
      return this.user.accessToken;
    return localStorage.getItem('access_token');
  }

  createAuthHeaders(): Headers {
    return new Headers ({
      'Content-Type'   : 'application/json',
      'x-access-token' : this.getAccessToken()
    });
  }

  private clearUserInfo(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
  }

  private storeUserInfo(): void {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        name: this.user.name,
        email: this.user.email,
        profilePic: this.user.profilePic
      })
    );
    localStorage.setItem('access_token', this.user.accessToken);
  }

  private getClientId(): Promise<string> {
    return this.http.get(this.clientIdUrl)
    .toPromise()
    .then((res:any) => {
      return res.json().client_id;
    }).catch((err:any) => { console.log(err); });
  }

}

export class User {
  name: string;
  email: string;
  profilePic: string;
  accessToken: string;

  constructor(name:string, email:string, profilePic: string, accessToken:string) {
    this.name = name;
    this.email = email;
    this.profilePic = profilePic;
    this.accessToken = accessToken;
  }
}
