import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
 Generated class for the ServiceMaintenance page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-service-maintenance',
    templateUrl: 'service-maintenance.html'
})
export class ServiceMaintenancePage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ServiceMaintenancePage');
    }

    go_back() {
        this.navCtrl.pop();
    }
}
