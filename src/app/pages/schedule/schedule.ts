import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController, IonList, LoadingController, ModalController, ToastController} from '@ionic/angular';

import {ScheduleFilterPage} from '../schedule-filter/schedule-filter';
import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';
import {DataService} from '../../providers/data.service';
import * as moment from 'moment';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage {
  // Gets a reference to the list element
  @ViewChild('scheduleList') scheduleList: IonList;

  objectKeys = Object.keys;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  dues: any = {};


  constructor(
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    private http: DataService,
    public toastCtrl: ToastController,
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

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      componentProps: {excludedTracks: this.excludeTracks}
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
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

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}
