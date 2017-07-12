/**
 * Created by 谢大见 on 2017/6/21.
 */
import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { ContactTypePipe } from './contactTypePipe';
import { notContactReasonPipe } from './notContactReasonPipe';
import { NumToTimePipe } from './numtotimePipe';
import { TrackResultPipe } from './trackResultPipe';
import { DataSubstringPipe } from './dataSubstringPipe';

@NgModule({
    declarations: [
        ContactTypePipe,
        notContactReasonPipe,
        NumToTimePipe,
        TrackResultPipe,
        DataSubstringPipe,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ContactTypePipe,
        notContactReasonPipe,
        NumToTimePipe,
        TrackResultPipe,
        DataSubstringPipe,
    ]
})
export class PipesModule { }