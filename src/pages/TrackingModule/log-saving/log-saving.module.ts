import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogSavingPage } from './log-saving';

@NgModule({
  declarations: [
    LogSavingPage,
  ],
  imports: [
    IonicPageModule.forChild(LogSavingPage),
  ],
  exports: [
    LogSavingPage
  ]
})
export class LogSavingPageModule {}
