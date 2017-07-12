import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindPasswdPage } from './find-passwd';

@NgModule({
  declarations: [
    FindPasswdPage,
  ],
  imports: [
    IonicPageModule.forChild(FindPasswdPage),
  ],
  exports: [
    FindPasswdPage
  ]
})
export class FindPasswdPageModule {}
