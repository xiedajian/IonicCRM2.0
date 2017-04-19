import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Platform} from 'ionic-angular';
import {TabsPage} from '../../tabs/tabs';
import {InterfaceLists} from '../../../providers/interface_list';
import {AppConfig} from '../../../app/app.config';
import {PopSer} from '../../../providers/pop-ser';

@Component({
    selector: 'page-today-schedule',
    templateUrl: 'today-schedule.html',
})
export class TodayScheduleComponent {
    userName:string = '';
    todayNum:number = 0;
    overdueTracks:number=0;
    morningNum:number = 0;
    show:boolean=false;//收起

    constructor(public navCtrl:NavController, public storage:Storage, public interface_lists:InterfaceLists, public popser:PopSer, public platform:Platform) {
    }

    goToTrackingList() {
        let dd:any = (new Date()).toLocaleDateString();//今天日期
        this.storage.set('dayFirst', dd);
        this.navCtrl.push(TabsPage);
    }

    pickUP(){
        this.show=!this.show;
    }

    ionViewDidLoad() {
        this.userName = AppConfig.getUserInfo().name;

        // console.log(AppConfig.getInited());
        // console.log(AppConfig.expireDate);

        if (!AppConfig.getInited()) {
            this.popser.alert('系统暂不可用', ()=> {
                this.platform.exitApp();
            });
        } else if (AppConfig.getIsExpired()) {
            this.popser.alert('使用已超期，请联系管理员续费', ()=> {
                this.platform.exitApp();
            });
        } else {
            this.interface_lists.workspace().then((returnData)=> {
                // console.log(returnData);
                if (returnData.isSucceed && returnData.data) {
                    this.todayNum = returnData.data.todayTracks;
                    this.morningNum = returnData.data.tomorrowTracks;
                    this.overdueTracks= returnData.data.overdueTracks;
                }
            });
        }
    }
}
