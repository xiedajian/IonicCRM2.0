import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LoginComponent} from '../login/login';
import {Storage} from '@ionic/storage';
import {AppConfig} from '../../../app/app.config';

@Component({
    selector: 'page-begin-guide',
    templateUrl: 'begin-guide.html'
})
export class BeginGuideComponent {

    constructor(public navCtrl:NavController, public storage:Storage) {
    }

    ionViewDidLoad() {
        console.log('Hello WelcomePage Page');
    }

    goToHome() {
        this.storage.set('appFirst', AppConfig.appVersion);

        // alert('AppConfig.Appmodel---' + AppConfig.Appmodel);
        // alert('AppConfig.platform---'+AppConfig.platform);
        // alert('AppConfig.deviceid---'+AppConfig.deviceid);
        // alert('AppConfig.appName---'+AppConfig.appName);
        // alert('AppConfig.appVersion---'+AppConfig.appVersion);
        // alert('AppConfig.token---'+AppConfig.token);
        // alert('AppConfig.userName---'+AppConfig.userName);
        // alert('AppConfig.userProtocol---'+AppConfig.userProtocol);
        // alert(AppConfig.userInfo);
        // alert('AppConfig.callingType---'+AppConfig.callingType);
        // alert('AppConfig.inited---'+AppConfig.inited);
        // alert('AppConfig.balanceMinute---'+AppConfig.balanceMinute);
        // alert('AppConfig.showCustomerPhone---'+AppConfig.showCustomerPhone);
        // alert('AppConfig.expireDate---'+AppConfig.expireDate);

        this.navCtrl.push(LoginComponent);
    }

}
