import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, User } from './auth.service';

@Injectable()
export class StartupService {
  
  private user: User;

  constructor(
    private authSvc: AuthService
  ) {}

  load(): Promise<User> {
    return this.authSvc.initUser()
      .then((user:User) => user)
      .catch(() => null);
  }

  getUser(): User {
    return this.user;
  }
}