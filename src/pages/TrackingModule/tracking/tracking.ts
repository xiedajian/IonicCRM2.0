import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

import {LogSavingComponent} from '../log-saving/log-saving'
import {Customer} from "../../SharedModule/customer.model";

/*
  Generated class for the Tracking page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tracking',
  templateUrl: 'tracking.html'
})
export class TrackingComponent {

    customer:Customer;
    contactType:number;
    callerPhone:string;

    constructor(public navCtrl:NavController, public navParams:NavParams) {
        this.customer = navParams.get('customer');
        this.contactType = navParams.get('contactType');
        this.callerPhone = navParams.get('callerPhone');
    }

    gotoLogSaving(isContacted) {
        console.log(isContacted, this.customer, this.contactType);
        this.navCtrl.push(LogSavingComponent, {
            isContacted: isContacted,
            customer: this.customer,
            contactType: this.contactType,
            callerPhone: this.callerPhone
        });
    }

    ionViewDidLoad() {
        console.log('Hello TrackingPage Page');
    }

}
