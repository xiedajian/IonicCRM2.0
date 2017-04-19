import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

import {LogSavingComponent} from '../log-saving/log-saving'
import {Customer} from "../../SharedModule/customer.model";
import {CallSer} from '../../../providers/call-ser';

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
    hideBackBtn:boolean=true;
    isCanLeave:boolean = false;//是否可以离开页面  （权限：后退是false，前进为true）

    constructor(public navCtrl:NavController, public navParams:NavParams,public callSer:CallSer) {
        this.customer = navParams.get('customer');
        this.contactType = navParams.get('contactType');
        this.callerPhone = navParams.get('callerPhone');
        if (this.contactType == 0) {
            this.hideBackBtn = false;
        }
    }

    gotoLogSaving(isContacted) {
        this.isCanLeave=true;//可以离开页面
        if( this.contactType==2){
            this.callSer.UxinCallUnbind();//解绑
        }
        // console.log(isContacted, this.customer, this.contactType);
        this.navCtrl.push(LogSavingComponent, {
            isContacted: isContacted,
            customer: this.customer,
            contactType: this.contactType,
            callerPhone: this.callerPhone
        });
    }

    ionViewDidLoad() {
        // console.log('Hello TrackingPage Page');
    }

    // 页面变成当前激活页面的时候执行的事件。
    ionViewWillEnter(){
        this.isCanLeave=false;
    }
    //是否可以离开此页面权限控制
    ionViewCanLeave(): boolean{
        if( this.isCanLeave){
            return true;
        }else {
            if(this.contactType == 0){
                return true;
            }
            return false;
        }
    }
}
