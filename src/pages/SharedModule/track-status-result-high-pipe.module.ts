/**
 * Created by 谢大见 on 2017/6/21.
 */
import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { TrackStatusTextPipe,TrackResultTextPipe,TrackDateCalcTypePipe,CustomerStatusTextPipe } from './track-text.pipe';
import { HighlightPipe} from './highlight.pipe';
import {CustomerLevelTextPipe,CustomerLevelClassPipe} from './customer-level.pipe';
import {HotBrandPipe} from './hot-brand.pipe';

@NgModule({
    declarations: [
        TrackStatusTextPipe,TrackResultTextPipe,TrackDateCalcTypePipe,CustomerStatusTextPipe,
        HighlightPipe,
        CustomerLevelTextPipe,
        CustomerLevelClassPipe,
        HotBrandPipe,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TrackStatusTextPipe,TrackResultTextPipe,TrackDateCalcTypePipe,CustomerStatusTextPipe,
        HighlightPipe,
        CustomerLevelTextPipe,
        CustomerLevelClassPipe,
        HotBrandPipe,
    ]
})
export class TrackTextModule { }