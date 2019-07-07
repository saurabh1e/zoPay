import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {HttpClient} from '@angular/common/http';
import {Events} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService<any> {

  user: any;
  constructor(http: HttpClient, public events: Events, public storage: Storage) {
    super(http, {path: ''});
  }

  async login(username: string, password: string): Promise<any> {
    try {
      const res = await this.create({mobile_number: username, password: password}, {}, 'login/');
      console.log(res);
      return this.storage.set('auth_token', res['authentication_token']).then(() => {
        this.storage.set('user', res['user']).then();
        this.user = res['user'];
        return this.events.publish('user:login');
      });
    } catch (e) {
      console.error(e);
    }

  }

  async signUp(obj) {
      return this.create(obj, {}, 'register/');
  }

  async isLoggedIn(): Promise<boolean> {
    return this.storage.get('auth_token');
  }

  async verify(data) {
    const res = await this.create(data, {}, 'verify/');

    return this.storage.set('auth_token', res['authentication_token']).then(() => {
      this.storage.set('user', res['user']).then();
      this.user = res['user'];
      return this.events.publish('user:login');
    });

  }
}
