import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackingPage } from './tracking';

@NgModule({
  declarations: [
    TrackingPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackingPage),
  ],
  exports: [
    TrackingPage
  ]
})
export class TrackingPageModule {}
