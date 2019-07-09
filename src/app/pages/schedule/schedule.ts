import {Component, ViewChild} from '@angular/core';
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
    public user: UserData
  ) {
  }

  ionViewDidEnter() {
    this.getDues().then();
  }

  async getDues() {
    try {
      const res = await this.http.query({
        __order_by: 'due_date', __is_cancelled__bool: false,
        __is_paid__bool: false
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
    }

  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, due: any, key: string) {

    // create an alert instance
    const alert = await this.alertCtrl.create({
      header: 'Due Cleared',
      buttons: [{
        text: 'OK',
        handler: () => {
          // close the sliding item
          slidingItem.close();
          this.dues[key].splice(this.dues[key].indexOf(due), 1);
        }
      }]
    });
    // now present the alert on top of all other content
    await alert.present();

  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
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
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
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
      }
    });
    return await model.present();
  }
}
