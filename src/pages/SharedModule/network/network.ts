import { Component,OnInit,OnDestroy,OnChanges,DoCheck,AfterContentInit,AfterContentChecked,AfterViewInit,AfterViewChecked } from '@angular/core';

import { NavController } from 'ionic-angular';
/*
  Generated class for the Tracking page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-network',
  templateUrl: 'network.html'
})
export class NetworkComponent implements OnInit,OnDestroy,DoCheck,AfterContentInit,AfterContentChecked,AfterViewInit,AfterViewChecked{

    //网络是否可用
    network:boolean = false;
    //定时检测网络句柄
    networkInt:number;

    constructor(public navCtrl:NavController) {

    }

    ngOnInit(){
        //this.checkNetwork();
        // console.log("ngOnInit");
    }

    ngOnDestroy() {
        // console.log("ngOnDestroy");
        clearInterval(this.networkInt);
    }

    /*ngOnChanges(){
        console.log("ngOnChanges");
    }*/

    ngDoCheck(){
        //console.log("ngDoCheck");
    }

    ngAfterContentInit(){
        // console.log("ngAfterContentInit");
    }

    ngAfterContentChecked(){
        //console.log("ngAfterContentChecked");
    }

    ngAfterViewInit(){
        // console.log("ngAfterViewInit");
    }

    ngAfterViewChecked(){
        //console.log("ngAfterViewChecked");
    }

    //检查网络状态
    checkNetwork() {
        this.networkInt = setInterval(() => {
            // console.log("checkNetwork");
            this.network = false;
        }, 3000);
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad');
    }

    ionViewDidEnter(){
        // console.log('ionViewDidEnter');
    }

    ionViewDidLeave(){
        // console.log('ionViewDidLeave');
    }

    test(){
        // console.log('aa');
    }

}
