import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackingLogPage } from './tracking-log';
import { PipesModule } from '../../../pipes/pipes.module';
// import { notContactReasonPipe } from '../../../pipes/notContactReasonPipe';
// import { NumToTimePipe } from '../../../pipes/numtotimePipe';
// import { TrackResultPipe } from '../../../pipes/trackResultPipe';
// import { DataSubstringPipe } from '../../../pipes/dataSubstringPipe';
@NgModule({
  declarations: [
    TrackingLogPage,
    // TrackResultPipe,
    // notContactReasonPipe,
    // NumToTimePipe,
    // DataSubstringPipe,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(TrackingLogPage),
  ],
  exports: [
    TrackingLogPage
  ]
})
export class TrackingLogPageModule {}
