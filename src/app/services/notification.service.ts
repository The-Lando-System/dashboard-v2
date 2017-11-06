import { Injectable, OnInit } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

@Injectable()
export class NotificationService implements OnInit {

  constructor(
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {}

  success(message:string): void {
    this.broadcaster.broadcast(Notification.SUCCESS, message);
  }

  warn(message:string): void {
    this.broadcaster.broadcast(Notification.WARN, message);
  }

  fail(message:string): void {
    this.broadcaster.broadcast(Notification.FAIL, message);
  }

  loading(isLoading:boolean): void {
    this.broadcaster.broadcast(Notification.LOADING, isLoading);
  }
}

export const Notification = {
  SUCCESS: 'NOTIFICATION_SUCCESS',
  WARN: 'NOTIFICATION_WARN',
  FAIL: 'NOTIFICATION_FAIL',
  LOADING: 'LOADING'
}