import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {SchedulePage} from './schedule';
import {ScheduleFilterPage} from '../schedule-filter/schedule-filter';
import {SchedulePageRoutingModule} from './schedule-routing.module';
import {AutoCompleteModule} from 'ionic4-auto-complete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule,
    AutoCompleteModule
  ],
  declarations: [
    SchedulePage,
    ScheduleFilterPage
  ],
  entryComponents: [
    ScheduleFilterPage
  ]
})
export class ScheduleModule { }
