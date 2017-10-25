import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';

import { Globals } from '../globals';

declare const gapi: any;

@Injectable()
export class AuthService {

  user: User;

  private googleUrl = Globals.SVC_DOMAIN + '/google';

  constructor(
    private http: Http,
    private zone: NgZone
  ) {

    this.getClientId()
    .then((id) => {
      Globals.GOOGLE_CLIENT_ID = id;
    });
  }

  login() {
    return new Promise<{}>((resolve, reject) => {
      gapi.load('auth2', () => {
        let auth2 = gapi.auth2.init({
          client_id: Globals.GOOGLE_CLIENT_ID,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        //Login button reference
        let loginButton: any = document.getElementById('google-login-button');
        auth2.attachClickHandler(
          loginButton, {},
          (userDetails) => {
            let profile = userDetails.getBasicProfile();
            
            this.user = new User(
              profile.getId(),
              profile.getName(),
              profile.getEmail(),
              profile.getImageUrl()
            );
            resolve(this.user);
          },
          (error) => {
            console.log(JSON.stringify(error, undefined, 2));
            reject(false);
          }
        );
      });
    });
  }

  logout() {
    //You will be redirected to this URL after logging out from Google.
    let homeUrl = "http://localhost:4200";
    let logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + homeUrl;
    document.location.href = logoutUrl;
  }


  private getClientId(): Promise<string> {
    return this.http.get(`${this.googleUrl}/client-id`)
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
