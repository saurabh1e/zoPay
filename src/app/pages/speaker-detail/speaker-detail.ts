import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConferenceData} from '../../providers/conference-data';
import {DataService} from '../../providers/data.service';

@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html',
  styleUrls: ['./speaker-detail.scss'],
})
export class SpeakerDetailPage implements OnInit {
  users: any;

  constructor(
    private dataProvider: ConferenceData,
    private router: Router,
    private http: DataService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const res = await this.http.query({
      __only: ['id', 'first_name', 'last_name', 'fixed_due', 'subscriptions'],
      __include: ['fixed_dues', 'subscriptions']
    }, 'user');
    this.users = res.data;
  }
}
