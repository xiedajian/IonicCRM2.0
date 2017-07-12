import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePassswdPage } from './change-passswd';

@NgModule({
  declarations: [
    ChangePassswdPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePassswdPage),
  ],
  exports: [
    ChangePassswdPage
  ]
})
export class ChangePassswdPageModule {}
