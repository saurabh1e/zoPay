import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {UserData} from '../../providers/user-data';
import {AuthService} from '../../providers/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: any = { phone: null, password: null };
  submitted = false;

  constructor(
    private auth: AuthService,
    public userData: UserData,
    public router: Router
  ) { }

  onLogin(form: NgForm) {
    console.log(form, form.valid, this.login);
    if (form.valid) {
      this.auth.login(this.login.phone.toString(), this.login.password).then( (r) => {
        console.log(r);
        this.router.navigateByUrl('/tutorial');
      });

    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
