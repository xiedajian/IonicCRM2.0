import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchMorePage } from './search-more';
// import {HighlightPipe} from '../../SharedModule/highlight.pipe';
// import {TrackStatusTextPipe,TrackResultTextPipe,TrackDateCalcTypePipe,CustomerStatusTextPipe} from '../../SharedModule/track-text.pipe';
import {TrackTextModule} from '../../SharedModule/track-status-result-high-pipe.module';
@NgModule({
  declarations: [
    SearchMorePage,
    // HighlightPipe,
    // TrackStatusTextPipe,
    // TrackResultTextPipe,
  ],
  imports: [
    TrackTextModule,
    IonicPageModule.forChild(SearchMorePage),
  ],
  exports: [
    SearchMorePage
  ]
})
export class SearchMorePageModule {}
