import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackingListPage } from './tracking-list';
// import {HotBrandPipe} from '../../SharedModule/hot-brand.pipe';
// import {CustomerLevelTextPipe,CustomerLevelClassPipe} from '../../SharedModule/customer-level.pipe';
import {TrackTextModule} from '../../SharedModule/track-status-result-high-pipe.module';
@NgModule({
  declarations: [
    TrackingListPage,
    // HotBrandPipe,
    // CustomerLevelTextPipe,
    // CustomerLevelClassPipe,
  ],
  imports: [
    TrackTextModule,
    IonicPageModule.forChild(TrackingListPage),
  ],
  exports: [
    TrackingListPage
  ]
})
export class TrackingListPageModule {}
