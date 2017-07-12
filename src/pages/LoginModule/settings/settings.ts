import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AppConfig} from '../../../app/app.config';
import {InterfaceLists}  from '../../../providers/interface_list';
/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  hasNewApp:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage,public interface_lists:InterfaceLists) {
  }

  ionViewDidLoad() {
    this.checkVersion();
  }

  go_version() {
    this.navCtrl.push('VersionInfoPage');
  }

  md_pwd() {
    this.navCtrl.push('ChangePassswdPage');
  }

  logout() {
    //清空localStorage
    // this.storage.clear();
    // this.storage.remove(key);
    AppConfig.token = '';
    AppConfig.userName = '';
    AppConfig.userInfo = {};
    this.storage.remove('userInfo');
    // this.navCtrl.push(LoginComponent);
    // this.navCtrl.setRoot(LoginComponent);
    // this.navCtrl.setPages(LoginComponent);
    this.navCtrl.parent.parent.setRoot('LoginPage');
  }

  checkVersion() {
    this.interface_lists.AppVersionCheck({version:AppConfig.getAppVersion()}).then(
        (returnData)=> {
          if (returnData.isSucceed) {
            if (returnData.data.hasNewVersion) {  //有新版本
              this.hasNewApp = true;
            }
          }
        });
  }
}
