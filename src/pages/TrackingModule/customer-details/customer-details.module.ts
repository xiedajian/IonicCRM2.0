import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerDetailsPage } from './customer-details';
// import {TrackStatusTextPipe,TrackResultTextPipe,TrackDateCalcTypePipe,CustomerStatusTextPipe} from '../../SharedModule/track-text.pipe';
// import {DataSubstringPipe} from '../../../pipes/dataSubstringPipe';
import { PipesModule } from '../../../pipes/pipes.module';
// import { notContactReasonPipe } from '../../../pipes/notContactReasonPipe';
// import { NumToTimePipe } from '../../../pipes/numtotimePipe';
// import { TrackResultPipe } from '../../../pipes/trackResultPipe';
import {TrackTextModule} from '../../SharedModule/track-status-result-high-pipe.module';
@NgModule({
  declarations: [
    CustomerDetailsPage,
    // TrackStatusTextPipe,
    // TrackResultTextPipe,
    // TrackDateCalcTypePipe,
    // CustomerStatusTextPipe,
    // DataSubstringPipe,
    // notContactReasonPipe,
    // NumToTimePipe,
    // TrackResultPipe,
  ],
  imports: [
    PipesModule,
    TrackTextModule,
    IonicPageModule.forChild(CustomerDetailsPage),
  ],
  exports: [
    CustomerDetailsPage
  ]
})
export class CustomerDetailsPageModule {}
