import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Broadcaster } from 'sarlacc-angular-client';
import { Globals } from '../globals';

declare const gapi: any;

@Injectable()
export class AuthService {

  private user: User;
  private clientIdUrl = Globals.SVC_DOMAIN + '/google/client-id';
  private logoutUrl =
    'https://www.google.com/accounts/Logout' + 
    '?continue=https://appengine.google.com/_ah/logout?continue=' + Globals.THIS_DOMAIN;
  private verifyTokenUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';

  constructor(
    private http: Http,
    private broadcaster: Broadcaster
  ){
    this.getClientId()
    .then((id) => {
      Globals.GOOGLE_CLIENT_ID = id;
      this.user = this.getUser();
      if (this.user) { this.user.accessToken = this.getAccessToken() };
    });
  }

  initUser(): Promise<User> {
    return new Promise<User>((resolve,reject) => {
      let accessToken = this.getAccessToken();
      let user = this.getUser();
      if (accessToken && user) {
        this.http.post(this.verifyTokenUrl + accessToken, {}, null)
        .toPromise()
        .then((res:any) => {
          let tokenInfo = res.json();
          if (!tokenInfo || !tokenInfo.email) {
            console.log('No email in the token info response... rejecting');
            reject();
          }

          if (user.email === tokenInfo.email) {
            resolve(user);
            return;
          }

          console.log('Unknown error verifying the token...');
          reject();

        }).catch((err:any) => {
          this.refreshOnInvalidToken(err)
          .then(() => { resolve(user); }).catch(() => { reject(); });
        });
      }
    });
  }

  login(): Promise<User> {
    return new Promise<User>((resolve, reject) => {

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
          this.broadcaster.broadcast('USER_LOGIN');
          resolve(this.user);
        });
      });
    });
  }

  logout(): void {
    this.clearUserInfo();
    document.location.href = this.logoutUrl;
  }

  refreshLogin(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      if (!gapi) {
        reject();
      }

      gapi.load('auth2', () => {
        let auth2 = gapi.auth2.init({
          client_id: Globals.GOOGLE_CLIENT_ID,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        }).then(()=> {
          gapi.auth2.getAuthInstance().currentUser.get()
          .reloadAuthResponse().then((authResponse) => {
            this.user.accessToken = authResponse.access_token;
            this.storeUserInfo();
            resolve();
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

  private refreshOnInvalidToken(err:any): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      if (!err.hasOwnProperty('error') || err.error !== 'invalid_token') {
        reject();
        return;
      }
      this.refreshLogin()
      .then(() => {
        resolve();
        return;
      }).catch(() => {
        console.log('Unknown error occurred during request.. rejecting');
        reject();
      });
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
