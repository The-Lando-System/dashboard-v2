import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '../services/broadcaster';
import { Notification } from '../services/notification.service';

@Component({
  moduleId: module.id,
  selector: 'notification',
  templateUrl: 'notification.component.html',
  styleUrls: [ 'notification.component.css' ]
})
export class NotificationComponent implements OnInit {

  private type: string;
  private message: string;
  private loading: boolean;

  constructor(
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.listenForSuccessNotification();
    this.listenForWarnNotification();
    this.listenForFailNotification();
    this.listenForLoading();
  }

  listenForSuccessNotification(): void {
    this.broadcaster.on(Notification.SUCCESS).subscribe((message:string) => {
      this.type = 'success';
      this.message = message;
      setTimeout(() => {
        this.reset();
      },3000);
    });
  }

  listenForWarnNotification(): void {
    this.broadcaster.on(Notification.WARN).subscribe((message:string) => {
      this.type = 'warn';
      this.message = message;
      setTimeout(() => {
        this.reset();
      },3000);
    });
  }

  listenForFailNotification(): void {
    this.broadcaster.on(Notification.FAIL).subscribe((message:string) => {
      this.type = 'fail';
      this.message = message;
      setTimeout(() => {
        this.reset();
      },3000);
    });
  }

  listenForLoading(): void {
    this.broadcaster.on(Notification.LOADING).subscribe((isLoading:boolean) => {
      this.loading = isLoading;
    });
  }

  private reset(): void {
    this.type = '';
    this.message = '';
  }

}