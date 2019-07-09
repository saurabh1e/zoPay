import {AfterViewInit, Component} from '@angular/core';
import {AlertController, Config, ModalController} from '@ionic/angular';
import {DataService} from '../../providers/data.service';


@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage implements AfterViewInit {
  ios: boolean;
  transaction_type: string;
  due: any = {name: null, due_date: new Date(), transaction_type: null, amount: null, customer_id: null, months: null};
  tracks: { name: string, icon: string, isChecked: boolean }[] = [];
  customers: any[] = [];


  constructor(
    private config: Config,
    private http: DataService,
    private alertController: AlertController,
    public modalCtrl: ModalController,
  ) {
  }

  ionViewWillEnter() {

  }

  // TODO use the ionViewDidEnter event
  ngAfterViewInit() {
    // passed in array of track names that should be excluded (unchecked)
  }

  async applyFilters() {
    this.due.transaction_type = this.transaction_type;
    const res = await this.http.create(this.due, {__only: ['id', 'amount', 'customer', 'due_date']}, 'due');
    this.dismiss(res.data[0]);
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

  async getResults(ev: any) {
    try {
      const res = await this.http.query({
        __first_name__starts_with: ev.target.value,
        __only: ['id', 'first_name', 'mobile_number']
      }, 'user');
      this.customers = res.data;

    } catch (e) {
      this.customers = [];
    }
  }

  async addNewCustomer() {

    const alert = await this.alertController.create({
      header: 'Add Customer',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          placeholder: 'Customer Name'
        },
        {
          name: 'mobile_number',
          type: 'number',
          id: 'name2-id',
          value: '',
          placeholder: 'Phone Number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (a) => {
            if (a) {
              try {
                a['mobile_number'] = a['mobile_number'].toString();
                await this.http.create(a, {}, 'customer_register/');
                await this.verifyCustomer(a['mobile_number']);
              } catch (e) {
              }

            }

          }
        }
      ]
    });

    await alert.present();
  }

  async verifyCustomer(phone: string) {
    const alert = await this.alertController.create({
      header: 'Verify Customer',
      inputs: [
        {
          name: 'otp',
          type: 'number',
          id: 'name2-id',
          value: '',
          placeholder: 'OTP'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (a) => {
            if (a) {
              try {
                a['mobile_number'] = phone;
                const res = await this.http.create(a, {}, 'customer_verify/');
                this.customers = [res];
              } catch (e) {
              }

            }

          }
        }
      ]
    });
    await alert.present();
  }

  setCustomer(customerId: number) {
    this.due.customer_id = customerId;
  }

  changeDate(ev) {
    console.log(ev);
    this.due.due_date = ev.detail.value;
  }
}
