import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RequestService implements OnInit {

  constructor(
    private http: Http,
    private router: Router,
    private notificationSvc: NotificationService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {}

  get(url:string, headers:Headers): Promise<any> {

    this.notificationSvc.loading(true);

    let options = {};
    if (headers) {
      options['headers'] = headers;
    }

    return new Promise<any>((resolve, reject) => {
      this.http.get(url, options)
      .toPromise()
      .then((res:any) => {
        this.notificationSvc.loading(false);
        resolve(res.json());
      }).catch((err:Response) => {
        this.handleErrorResponse(err);
        this.notificationSvc.loading(false);
        reject(err.json());
      });
    });
  }

  post(url:string, body:any, headers:Headers): Promise<any> {
    
    this.notificationSvc.loading(true);

    let options = {};
    if (headers) {
      options['headers'] = headers;
    }

    return new Promise<any>((resolve, reject) => {
      this.http.post(url, body, options)
      .toPromise()
      .then((res:any) => {
        this.notificationSvc.loading(false);
        resolve(res.json());
      }).catch((err:Response) => {
        this.handleErrorResponse(err);
        this.notificationSvc.loading(false);
        reject(err.json());
      });
    });
  }

  put(url:string, body:any, headers:Headers): Promise<any> {
    
    this.notificationSvc.loading(true);

    let options = {};
    if (headers) {
      options['headers'] = headers;
    }

    return new Promise<any>((resolve, reject) => {
      this.http.put(url, body, options)
      .toPromise()
      .then((res:any) => {
        this.notificationSvc.loading(false);
        resolve(res.json());
      }).catch((err:Response) => {
        this.handleErrorResponse(err);
        this.notificationSvc.loading(false);
        reject(err.json());
      });
    });
  }

  delete(url:string, headers:Headers): Promise<any> {
    
    this.notificationSvc.loading(true);

    let options = {};
    if (headers) {
      options['headers'] = headers;
    }

    return new Promise<any>((resolve, reject) => {
      this.http.delete(url, options)
      .toPromise()
      .then((res:any) => {
        this.notificationSvc.loading(false);
        resolve(res.json());
      }).catch((err:Response) => {
        this.notificationSvc.loading(false);
        this.handleErrorResponse(err);
        reject(err.json());
      });
    });
  }

  private handleErrorResponse(err:Response): void {
    let error = err.json();

    console.error(error);

    if (error.hasOwnProperty('error') || error['error'] === 'invalid_token') {
      this.authSvc.refreshToken();
      this.router.navigate['/'];
    }
  }

}