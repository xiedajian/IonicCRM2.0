import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PopSer}     from '../../../providers/pop-ser';
import {UpdateAppSer}     from '../../../providers/updateApp-ser';
import {AppConfig} from '../../../app/app.config';
/**
 * Generated class for the VersionInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-version-info',
  templateUrl: 'version-info.html',
})
export class VersionInfoPage {
  public versionNum:string = '';//版本号
  constructor(public navCtrl: NavController, public navParams: NavParams,public popser:PopSer, public updateApp:UpdateAppSer) {
  }


  ionViewDidLoad() {
    this.versionNum=AppConfig.appVersion;
  }

  checkUpdate() {
    this.popser.loadingDIY('show', '正在检查新版本...');
    setTimeout(()=> {
      this.popser.loadingDIY('hide');
      this.updateApp.checkUpdate();
    }, 2000)
  }

}
