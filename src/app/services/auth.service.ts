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

      this.getClientId()
      .then((id) => {
        Globals.GOOGLE_CLIENT_ID = id;
        
        let accessToken = this.getAccessToken();
        let user = this.getUser();

        if (!user || !accessToken) {
          console.log('No user or access token saved in local storage... rejecting');
          this.resetUser();
          reject();
          return;
        }

        this.http.post(this.verifyTokenUrl + accessToken, {}, null)
        .toPromise()
        .then((res:any) => {
          let tokenInfo = res.json();
          if (!tokenInfo || !tokenInfo.email) {
            console.log('No email in the token info response... rejecting');
            this.resetUser();
            reject();
            return;
          }

          if (user.email === tokenInfo.email) {
            console.log('Successfully verified the token!')
            resolve(user);
            return;
          }

          console.log('Unknown error verifying the token...');
          this.resetUser();
          reject();
          return;
        }).catch((error:any) => {

          let err = error.json();

          console.log('Failed to verify the access token...');

          if (!err.hasOwnProperty('error') || err.error !== 'invalid_token') {
            console.log('Not attempting to refresh token..  Error was not an invalid token error');
            this.resetUser();
            reject();
            return;
          }
          this.refreshLogin()
          .then(() => {
            console.log('Successfully refreshed the token');
            resolve();
            return;
          }).catch(() => {
            console.log('Unknown error occurred during request.. rejecting');
            this.resetUser();
            reject();
          });
        });

      });

    });
  }

  login(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      // Load the client
      this.loadGoogleAuth()
      .then(() => {
        
        // Sign in using the Google OAuth page
        this.signIn();
        
        // Callback for signin results
        this.listenForAuth()
        .then(() => {
          resolve();
        }).catch(() => {
          reject();
        });

      // Reject if the client fails to load
      }).catch(() => {
        reject();
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
        console.log('No GAPI object defined, rejecting the login refresh...');
        this.resetUser();
        reject();
        return;
      }

      if (!this.user) {
        console.log('No user in local storage, rejecting the login refresh...');
        this.resetUser();
        reject();
        return;
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

  private loadGoogleAuth(): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: Globals.GOOGLE_CLIENT_ID,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        }).then(() => {
          resolve();
        }, (err:any) => {
          console.log('Error initializing auth2 client!');
          console.log(err);
          reject();
        });
      }, (err:any) => {
        console.log('Error loading the auth2 client!');
        console.log(err);
        reject();
      });
    });
  }

  private signIn(): void {
    gapi.auth2.getAuthInstance().signIn();
  }

  private listenForAuth(): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      gapi.auth2.getAuthInstance().currentUser.listen((userDetails) => {
        if (!userDetails) {
          console.log('No user details... rejecting')
          reject();
        }

        let profile = userDetails.getBasicProfile();
        if (!userDetails) {
          console.log('No profile in the user details... rejecting');
          reject();
        }

        this.user = new User(
          profile.getName(),
          profile.getEmail(),
          profile.getImageUrl(),
          userDetails.getAuthResponse().access_token
        );
        console.log('Storing user details in local storage!');
        this.storeUserInfo();
        this.broadcaster.broadcast('USER_LOGIN');
        resolve();
      });
    });
  }

  private resetUser(): void {
    this.user = null;
    this.clearUserInfo();
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
