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
        // console.log('Hello WelcomePage Page');
    }

    goToHome() {
        this.storage.set('appFirst', AppConfig.appVersion);
        this.navCtrl.push(LoginComponent);
    }

}
