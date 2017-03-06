import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {VersionInfoPage} from '../version-info/version-info';
import {ChangePasswordPage} from '../change-password/change-password';
import {LoginComponent} from '../login/login';
import {UpdateAppSer}     from '../../../providers/updateApp-ser';
import {AppConfig} from '../../../app/app.config';
import {InterfaceLists}  from '../../../providers/interface_list';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {
    hasNewApp:boolean = false;

    constructor(public navCtrl:NavController, public updateApp:UpdateAppSer, public storage:Storage,public interface_lists:InterfaceLists) {
    }

    ionViewDidLoad() {
        this.checkVersion();
    }

    go_version() {
        this.navCtrl.push(VersionInfoPage);
    }

    md_pwd() {
        this.navCtrl.push(ChangePasswordPage);
    }

    logout() {
        //清空localStorage
        // this.storage.clear();
        // this.storage.remove(key);
        AppConfig.token = '';
        AppConfig.userName = '';
        AppConfig.userInfo = {};
        this.storage.remove('userInfo');
        this.navCtrl.push(LoginComponent);
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
