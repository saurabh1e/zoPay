import {Component} from '@angular/core';
import {DataService} from '../../providers/data.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage {
  bankDetails = {
    bank_name: null,
    account_no: null,
    branch_name: null,
    ifsc_code: null,
    id: null
  };

  constructor(
    private http: DataService,
  ) {
  }

  ionViewDidEnter() {
    this.getBankDetail().then();
  }

  async getBankDetail() {
    try {
      const res = await this.http.query({}, 'bank_detail');
      console.log(res);
      this.bankDetails = res.data[0];
    } catch (e) {
    }

  }

  async createBankDetail() {
    try {
      const res = await this.http.create(this.bankDetails, {}, 'bank_detail');
      this.bankDetails.id = res.data[0].id;
    } catch (e) {
      console.error(e);

    }
  }

  async updateBankDetail() {
    try {

      const res = await this.http.update(this.bankDetails.id, this.bankDetails, {}, 'bank_detail');
    } catch (e) {
      console.error(e);
    }
  }

  CreateOrUpdate() {
    if (this.bankDetails.id) {
      return this.updateBankDetail();
    } else {
      return this.createBankDetail();
    }
  }

}
