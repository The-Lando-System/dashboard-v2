import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Broadcaster } from '../services/broadcaster';
import { Notification } from '../services/notification.service';

@Component({
  moduleId: module.id,
  selector: 'notification',
  templateUrl: 'notification.component.html',
  styleUrls: [ 'notification.component.css' ]
})
export class NotificationComponent implements OnInit {

  private message: string;
  private loading: boolean;

  constructor(
    private broadcaster: Broadcaster,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.listenForSuccessNotification();
    this.listenForWarnNotification();
    this.listenForFailNotification();
    this.listenForLoading();
  }

  listenForSuccessNotification(): void {
    this.broadcaster.on(Notification.SUCCESS).subscribe((message:string) => {
      this.snackBar.open(`Success! ${message}`,"ok",{
        duration: 2000,
      });
    });
  }

  listenForWarnNotification(): void {
    this.broadcaster.on(Notification.WARN).subscribe((message:string) => {
      this.snackBar.open(`Warning! ${message}`,"ok",{
        duration: 2000,
      });
    });
  }

  listenForFailNotification(): void {
    this.broadcaster.on(Notification.FAIL).subscribe((message:string) => {
      this.snackBar.open(`Fail! ${message}`,"ok",{
        duration: 2000,
      });
    });
  }

  listenForLoading(): void {
    this.broadcaster.on(Notification.LOADING).subscribe((isLoading:boolean) => {
      this.loading = isLoading;
    });
  }

}