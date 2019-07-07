import { Injectable } from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import {Storage} from '@ionic/storage';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private storage: Storage, private router: Router) {}

  canLoad() {
    return this.storage.get('auth_token').then(res => {
      if (res) {
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    });
  }
}
