import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Broadcaster } from 'sarlacc-angular-client';

import { Globals } from '../globals';

@Injectable()
export class GoogleService implements OnInit {

    private googleUrl = this.globals.google_domain + '/google';

    constructor(
      private http: Http,
      private broadcaster: Broadcaster,
      private globals: Globals
    ) {}

    ngOnInit(): void {
    }

    getClientId(): Promise<string> {
      return this.http.get(`${this.googleUrl}/client-id`)
      .toPromise()
      .then((res:any) => {
        return res.json().client_id;
      }).catch((err:any) => { console.log(err); });
    }
}