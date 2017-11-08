import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NotificationService } from './notification.service';

@Injectable()
export class RequestService implements OnInit {

  constructor(
    private http: Http,
    private notificationSvc: NotificationService
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
        this.logErrorResponse(err);
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
        this.logErrorResponse(err);
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
        this.logErrorResponse(err);
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
        this.logErrorResponse(err);
        reject(err.json());
      });
    });
  }

  private logErrorResponse(err:Response): void {
    console.error(err.json());
  }

}