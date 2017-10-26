import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

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
          let profile = userDetails.getBasicProfile();
          this.user = new User(
            profile.getId(),
            profile.getName(),
            profile.getEmail(),
            profile.getImageUrl()
          );
          this.storeUserInfo();
          resolve(this.user);
        });
      });
    });
  }

  logout() {
    this.clearUserInfo();
    document.location.href = this.logoutUrl;
  }

  getUser(): User {
    return this.user ? this.user : JSON.parse(localStorage.getItem('currentUser'));
  }

  private clearUserInfo(): void {
    localStorage.removeItem('currentUser');
  }

  private storeUserInfo(): void {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        profilePic: this.user.profilePic
      })
    );
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
  id: string;
  name: string;
  email: string;
  profilePic: string;

  constructor(id:string, name:string, email:string, profilePic: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.profilePic = profilePic;
  }
}
