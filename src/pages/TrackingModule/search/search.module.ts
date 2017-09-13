import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
// import {HighlightPipe} from '../../SharedModule/highlight.pipe';
// import {TrackStatusTextPipe,TrackResultTextPipe,TrackDateCalcTypePipe,CustomerStatusTextPipe} from '../../SharedModule/track-text.pipe';
import {TrackTextModule} from '../../SharedModule/track-status-result-high-pipe.module';
@NgModule({
  declarations: [
    SearchPage,
    // HighlightPipe,
    // TrackStatusTextPipe,
    // TrackResultTextPipe,
  ],
  imports: [
    TrackTextModule,
    IonicPageModule.forChild(SearchPage),
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule {}
