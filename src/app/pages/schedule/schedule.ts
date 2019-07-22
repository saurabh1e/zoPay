import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController, IonList, ModalController} from '@ionic/angular';
import {UserData} from '../../providers/user-data';
import {DataService} from '../../providers/data.service';
import * as moment from 'moment';
import {ScheduleFilterPage} from '../schedule-filter/schedule-filter';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulePage {
  // Gets a reference to the list element
  @ViewChild('scheduleList') scheduleList: IonList;

  objectKeys = Object.keys;
  queryText = '';
  dues: any = {};


  constructor(
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public router: Router,
    private http: DataService,
    public user: UserData,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ionViewDidEnter() {
    this.getDues().then();
  }

  async getDues() {
    try {
      this.dues = {};
      const res = await this.http.query({
        __order_by: 'due_date', __is_cancelled__bool: false,
        __is_paid__bool: false, __customer_name__contains: this.queryText,
      }, 'due');
      res.data.forEach(d => {
        const diff: number = moment().local().diff(d.due_date, 'days');
        if (diff > 0) {
          d.status = 'past';

        } else {
          d.status = 'future';
        }
        if (this.dues.hasOwnProperty(d.due_date)) {
          this.dues[d.due_date].push(d);
        } else {
          this.dues[d.due_date] = [d];
        }
      });

    } catch (e) {
    } finally {
      this.changeRef.detectChanges();
    }

  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, due: any, key: string) {

    // create an alert instance
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      buttons: [{
        text: 'OK',
        handler: async () => {
          // close the sliding item

          try {
            await this.http.create({razor_pay_id: null, due_id: due.id}, {}, 'payment');
            console.log(this.dues[key].findIndex(d => d.id === due.id));
            this.dues[key].splice(this.dues[key].findIndex(d => d.id === due.id), 1);
            this.changeRef.detectChanges();
          } catch (e) {
            console.error(e);
          }
          slidingItem.close();
        }
      },
        {
          text: 'CANCEL',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
    });
    // now present the alert on top of all other content
    await alert.present();

  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, due: any, key: string) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Would you like to cancel this payment?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: async () => {
            // they want to remove this session from their favorites
            try {
              const res = await this.http.update(due.id, {is_cancelled: true}, {}, 'due');
              this.dues[key].splice(this.dues[key].findIndex(d => d.id === due.id), 1);
              this.changeRef.detectChanges();
            } catch (e) {
              console.error(e);
            }
            // this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async createDue(transactionType: string, fab) {
    fab.close();
    const model = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      componentProps: {transaction_type: transactionType}
    });
    model.onDidDismiss().then((data: any) => {
      if (data.data) {
        if (this.dues.hasOwnProperty(data.data.due_date)) {
          this.dues[data.data.due_date].push(data.data);
        } else {
          this.dues[data.data.due_date] = [data.data];
        }
        this.changeRef.detectChanges();
      }
    });
    return await model.present();
  }
}
