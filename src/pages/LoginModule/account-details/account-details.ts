import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Config} from 'ionic-angular'
import { ModalController } from 'ionic-angular';
import {PopSer}     from '../../../providers/pop-ser';
import {InterfaceLists}  from '../../../providers/interface_list';
import {AppConfig} from "../../../app/app.config";

import {SettingsPage}     from '../settings/settings';
import {LoginComponent}     from '../login/login';
import {TrackingLogComponent}     from '../../TrackingModule/tracking-log/tracking-log';
import {NewsFeedComponent} from '../news-feed/news-feed';

declare var echarts;
import * as Highcharts from 'highcharts' ;

@Component({
    selector: 'page-account-details',
    templateUrl: 'account-details.html',
})
export class AccountDetailsComponent {
    @ViewChild('container') container:ElementRef;
    chart:any;
    name:string='';

    completionRate:any='0';  //跟踪完成率
    saleAmount:any='0'; //跟踪后产生的销售额
    VipBuyCount:number=0; //购买人数
    trackSuccessRate:any='0';//成功率
    trackLogNum:number=0;//日志数量

    src:any = [];//图片数组
    eachPicNum:number=10;//每个图片代表的人数

    constructor(public navCtrl:NavController, public modalCtrl:ModalController,public interface_lists:InterfaceLists, private popser:PopSer,public config:Config) {
        // console.log(config.get('pageTransition'));
    }

    //页面加载完毕触发。该事件发生在页面被创建成 DOM 的时候，且仅仅执行一次。如果页面被缓存（Ionic默认是缓存的）就不会再次触发该事件。该事件中可以放置初始化页面的一些事件。
    ionViewDidLoad(){
        this.hchart(this.completionRate);//里面的数值为服务器闯过来的值
        this.name=AppConfig.getUserInfo().name;
        this.getdata();
    }
    // 即将进入一个页面变成当前激活页面的时候执行的事件。
    ionViewWillEnter(){}
    // 进入了一个页面且变成了当前的激活页面，该事件不管是第一次进入还是缓存后进入都将执行。
    ionViewDidEnter() {

    }
    // 将要离开了该页面之后变成了不是当前激活页面的时候执行的事件。
    ionViewWillLeave(){}
    // 在页面完成了离开该页面并变成了不是当前激活页面的时候执行的事件。
    ionViewDidLeave(){}
    // 在页面销毁和页面中有元素移除之前执行的事件。
    ionViewWillUnload(){}
    // 在页面销毁和页面中有元素移除之后执行的事件。
    ionViewDidUnload(){}

    hchart(point:any){
        let Hchart :any={
            chart:{},
            position:0,
            charData:[0,19,23,40,41,66,75,100],
            pointSet:{
                y:point,
                marker:{
                    enabled: true,
                    fillColor: '#FFFFFF',//圆圈的填充颜色
                    lineWidth: 2,//圆圈的外边框
                    lineColor: '#F39800',//圆圈外边框颜色
                    radius: 6  //圆圈大小
                },
                dataLabels: {
                    enabled: true,
                    format: '{y}%',
                    style: {
                        "color": "#4D4D4D",
                        "fontSize": "14px"
                    },
                    y:-3,
                    //x:-23
                }
            }
        };
        //let change=function(y){
        //    charData[y]=point;
        //    position=y;
        //};
        for(let x=0;x<Hchart.charData.length;x++){
            switch(true){
                case Hchart.charData[x]=== point:
                    Hchart.charData[x]= Hchart.pointSet;
                    Hchart.charData=x;
                    //change(x);
                    break;
                case  Hchart.charData[x]< point &&  Hchart.charData[x+1] >point :
                    Hchart.charData.splice(x+1, 0,  Hchart.pointSet);
                    Hchart.position=x+1;
                    //change(x);
                    break;
                case point> Hchart.charData[ Hchart.charData.length-1]  :
                    Hchart.charData.splice( Hchart.charData.length, 0,  Hchart.pointSet);
                    Hchart.position= Hchart.charData.length;
                    //change(charData.length);
                    break;
                default:break;
            }
           // console.log( Hchart.charData);
        }
        let opts: any = {
            chart: {
                renderTo: this.container.nativeElement,//图表在html的位置
                margin:[-30,0,0,-6],
                spacing:[0, 0, 0, 0],
                backgroundColor: "#F5F5F5"
            },
            credits:{
                enabled:false // 禁用版权信息
            },
            tooltip: {
                //enabled:false
            },
            title:{
                text:null
            },
            legend:{
                enabled: false

            },
            xAxis: {
                visible: true//坐标轴不见
            },
            yAxis: {
                gridLineWidth: 0,//刻度线的宽度为即不可见
                visible: true
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false//标志点不可见
                    }

                },
                series: {
                    threshold: -50
                }
            },
            series: [{
                type: 'area',
                name:'本月完成率',
                data:  Hchart.charData,
                zoneAxis: 'x',
                zones: [{
                    value: Hchart.position,
                    color: '#F39800',
                    fillColor:"#F39800"
                }, {
                    color: '#F39A05',
                    fillColor:"#F4D9AB"
                }]
            }]
        };
        Hchart.chart = new Highcharts.Chart(opts);
    }

    getdata(){
        let dd=AppConfig.getLocalTime2();
        console.log(dd);
        this.interface_lists.overview({intdate:dd}).then((returnData)=>{
            if (returnData.isSucceed) {
                if (returnData.data) {
                    this.completionRate = returnData.data.completionRate; //跟踪完成率
                    this.saleAmount = returnData.data.saleAmount; //跟踪后产生的销售额
                    this.VipBuyCount = returnData.data.totalBuyer; //购买人数
                    this.trackSuccessRate = returnData.data.trackSuccedRate;//成功率
                    this.trackLogNum = returnData.data.totalTracklog;//日志数量
                    this.getbuyPeople();
                    this.hchart(this.completionRate);//里面的数值为服务器闯过来的值
                }
            }else {
                switch (returnData.code) {
                    case 400:
                        this.popser.alert('请求不合法（请求安全校验没有通过）');
                        break;
                    case 401:
                        this.popser.alert('请求要求身份验证（TOKEN无效）');
                        //this.navCtrl.push(LoginComponent);
                        break;
                    case 405:
                        this.popser.alert('请求被拒绝');
                        break;
                    case 500:
                        this.popser.alert('系统内部异常');
                        break;
                    default:
                        this.popser.alert('修改失败，请重试');
                        break;
                }
            }
        },()=>{
            this.popser.alert('服务器连接失败,请稍后再试');
        });
    }

    getbuyPeople() {
        if (this.VipBuyCount <= 100) {//人数未满100人
            this.eachPicNum = 10;
            let num:number = Math.floor(this.VipBuyCount / 10);//10人图片的数目
            let extra:number = this.VipBuyCount % 10;//有余数时，即未满10人
            for (let i = 0; i < 10; i++) {
                this.src[i] = i < num ? './img/gust_4.png' : './img/gust_5.png';
            }
            if (extra != 0) {
                this.src[num] = './img/gust_extra.png';//未满10人
            }
        } else {
            this.eachPicNum = 100;
            var num = Math.floor(this.VipBuyCount / 100);//满100人的数目
            var extra = this.VipBuyCount % 100;//有余数时，即未满100人
            for (let i = 0; i < 10; i++) {
                this.src[i] = i < num ? './img/full_100.png' : './img/gust_5.png';
            }
            if (extra != 0) {
                this.src[num] = './img/Less_than_100.png';//未满100人
            }
        }
    }

    go_trackLog() {
        this.navCtrl.push(TrackingLogComponent);
    }

    go_setting() {
        this.navCtrl.push(SettingsPage);
    }

    gotoNews(){//消息推送
        // let newsModal=this.modalCtrl.create(NewsFeedComponent);
        // newsModal.present();
        this.navCtrl.push(NewsFeedComponent);
    }

    tip() {
        this.popser.alert('图中1个小人代表' + this.eachPicNum + '个会员');
    }

    //跟踪完成率提示框
    tip_track() {
        let t = new Date().toLocaleDateString();
        this.popser.alert('跟踪后7天内有产生购买，即为跟踪成功。<br/>这里的跟踪成功率是自启用到' + t + '的所以跟踪成功的统计');
    }


}
