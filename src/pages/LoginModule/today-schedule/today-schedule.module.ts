import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodaySchedulePage } from './today-schedule';

@NgModule({
  declarations: [
    TodaySchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(TodaySchedulePage),
  ],
  exports: [
    TodaySchedulePage
  ]
})
export class TodaySchedulePageModule {}
