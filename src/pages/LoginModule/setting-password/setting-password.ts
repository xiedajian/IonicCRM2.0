import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {LoginComponent} from '../login/login'

/*
 Generated class for the SettingPassword page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-setting-password',
    templateUrl: 'setting-password.html'
})
export class SettingPasswordComponent {

    constructor(public navCtrl:NavController) {
    }

    goToLogin() {
        this.navCtrl.push(LoginComponent);
    }

    goToFindPassword() {
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        console.log('Hello SettingPasswordPage Page');
    }

}
