import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import {AuthService} from '../../providers/auth.service';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signUp: any = {first_name: null, last_name: null, mobile_number: null, email: null, business_name: null, password: null, otp: null};
  submitted = false;
  otp: boolean = false;

  constructor(
    private auth: AuthService,
    public router: Router,
    public userData: UserData
  ) {}

  onSignUp(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      const data  = Object.assign({}, this.signUp);
      data.mobile_number = data.mobile_number.toString();
      this.auth.signUp(data).then(r => {
        console.log(r);
        this.otp = true;
        // this.router.navigateByUrl('/login');
      });

    }
  }

  onVerify(form: NgForm) {
    if (form.valid) {
      const data  = Object.assign({}, {mobile_number: this.signUp.mobile_number.toString(), otp: this.signUp.otp});
      this.auth.verify(data).then(r => {
        this.router.navigateByUrl('/');
      });
    }
  }
}
