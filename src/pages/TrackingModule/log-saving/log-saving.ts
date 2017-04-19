import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
//import {TrackingComponent} from '../tracking/tracking';
import { PopSer }     from '../../../providers/pop-ser';
import {NetworkSer} from '../../../providers/network-ser';
import {Customer} from "../../SharedModule/customer.model";
//import {TrackingListComponent} from '../tracking-list/tracking-list';
//import {CustomerDetailsComponent} from '../customer-details/customer-details';
import {CustomerService} from '../../SharedModule/customer.service'
//import {CUSTOMER} from "../../SharedModule/customer.service";
import {CRMService} from '../../SharedModule/crm.service';
import {AppConfig} from "../../../app/app.config";
import {LoginComponent}     from '../../LoginModule/login/login';
import {ServiceMaintenancePage} from '../../SharedModule/service-maintenance/service-maintenance'
@Component({
  selector: 'page-log-saving',
  templateUrl: 'log-saving.html',
  //providers:[PopSer]
})
export class LogSavingComponent {

    //isContacted:boolean;//是否联系上
    manTrackTime:boolean;//是否显示人工指定选择时间页面
    notContactShow:boolean;//是否显示未联系原因弹窗
    contactTypeShow:boolean;
    contactType:number;
    contactTypeText:string='微信联系、QQ联系、短信联系等';
    customer:Customer;
    maxDate:string;

    TrackLog = {//跟踪日志结果
        orgId: 0,  //公司组织Id
        customerId: 0,  //客户Id
        contactType: 0,  //联系方式
        otherContactType:'',//其它联系方式
        isContacted: false,  //是否联系上
        notContactReason: 0,  //无法联系原因
        otherNotContactReason:'',//其它未联系上原因
        content: '',  //跟踪日志内容
        nextAction: 1,  //下次跟踪的动作
        nextTrackDate: '',  //下一次跟踪时间
        callerPhone:'',//导购号码
        calleePhone:''//会员号码
    };

    getFormatDate(d:any) {//获取格式化日期
        let date = new Date(d);
        let seperator = "-";
        let month:any = date.getMonth() + 1;
        let strDate:any = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getFullYear() + seperator + month + seperator + strDate;
    }


    constructor(public navCtrl:NavController,
                public navParams:NavParams,
                private popser:PopSer,
                public networkSer:NetworkSer,
                public customerServcie:CustomerService,
                public crmService:CRMService) {
        this.TrackLog.orgId = AppConfig.userInfo.orgId;
        this.TrackLog.isContacted = navParams.get('isContacted');//是否联系上
        this.customer = navParams.get('customer');
        this.TrackLog.customerId = this.customer.customerId;
        this.TrackLog.calleePhone = this.customer.contactMobile;
        this.TrackLog.contactType = navParams.get('contactType');
        if(this.TrackLog.contactType==1){
            this.TrackLog.callerPhone = navParams.get('callerPhone');
        }
        let now = new Date();
        this.TrackLog.nextTrackDate = this.getFormatDate(now);//下一次跟踪时间
        this.maxDate = this.getFormatDate(now.setFullYear(now.getFullYear() + 100));

        // console.log(this.TrackLog.nextTrackDate, this.maxDate);
    }

    selectReason() {//选择未联系上原因的弹窗出现
        this.unContactReason = this.TrackLog.notContactReason;
        this.notContactShow = true;
        setTimeout(function () {//横屏状态下，如果手机高度比弹窗高度小，则弹窗高度变小
            let reasonHeight=AppConfig.getWindowHeight();
            if(reasonHeight<286){
                let x=document.getElementById("reasonPop");
                x.style.maxHeight="240px";
                x.style.overflow="auto";

            }
        }, 3);

    }

    selectContactType(){
        this.contactType = this.TrackLog.contactType;
        this.contactTypeShow = true;
    }

    reason:string = "请选择";//未联系原因的页面显示
    unContactReason:number = 1;//未联系原因
    U_contact_reason(index) {//未联系上原因弹窗样式的切换
        this.unContactReason = index;
    }

    setUnContactReason() {//选定确定的未联系原因
        if (this.TrackLog.notContactReason === this.unContactReason) {
            this.notContactShow = false;
            return;
        }
        this.TrackLog.notContactReason = this.unContactReason;
        this.notContactShow = false;
        switch (this.unContactReason) {
            case 1:
                this.reason = "空号";
                break;
            case 2:
                this.reason = "电话号码错误";
                break;
            case 3:
                this.reason = "停机";
                break;
            case 4:
                this.reason = "无人接听";
                break;
            case 5:
                this.reason = "占线";
                break;
            case 6:
                this.reason = "其他";
                break;
            default:
                break;
        }
    }

    setContactType() {
        if (this.TrackLog.contactType === this.contactType) {
            this.contactTypeShow = false;
            return;
        }
        this.TrackLog.contactType = this.contactType;
        this.contactTypeShow = false;
        switch (this.contactType) {
            case 3:
                this.contactTypeText = "上门拜访";
                break;
            case 4:
                this.contactTypeText = "QQ";
                break;
            case 5:
                this.contactTypeText = "weixin微信";
                break;
            case 6:
                this.contactTypeText = "SMS短信";
                break;
            case 10:
                this.contactTypeText = "其它沟通渠道";
                break;
            default:
                break;
        }
    }

    LogSaveObj = {//保存日志弹窗内容
        title: '<div class="content_img"><img  src="img/saveLog.png" class="img"/></div>',
        cssClass: "Convex",  //如果有单行字，样式为Convex且message为空，否则为ConvexOut
        subTitle: "保存日志"
    };

    //模拟数据
    /*saveTrackLogByHttp(param:any):Promise<any> {
        let result = {
            isSucceed: true,
            data: {
                logInfo: {},
                customerInfo: CUSTOMER
            }
        };
        return Promise.resolve(result);
    }
    //模拟数据
    saveTrackLogByHttpSlow(param:any):Promise<any> {
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>this.saveTrackLogByHttp(param));
    }*/

    //保存日志弹窗确定按钮
    LogSaveCallback() {
        this.crmService.saveTrackLog(this.TrackLog).then((result)=> {
        //this.saveTrackLogByHttpSlow(this.TrackLog).then((result)=> {
            if (result.isSucceed) {
                this.customerServcie.removeUnSaveState();
                let customerInfo = result.data.customerInfo;
                this.customerServcie.removeCustomerById(this.customer.customerId);
                this.customerServcie.updateCustomer(customerInfo);
                let index = 0;
                if (this.navCtrl.length() >= 3) {
                    index = this.navCtrl.length() - 3;
                }
                this.navCtrl.popTo(this.navCtrl.getByIndex(index), {customer: customerInfo});
            }else {
                switch (result.code) {
                    case 600:   //600跳转到系统维护
                        this.navCtrl.push(ServiceMaintenancePage);
                        break;
                    case 400:
                        this.popser.alert('请求不合法（请求安全校验没有通过）');
                        break;
                    case 401:
                        this.popser.alert('请求要求身份验证（TOKEN无效）');
                        // this.navCtrl.push(LoginComponent);
                        this.navCtrl.parent.parent.setRoot(LoginComponent);
                        break;
                    case 500:
                        this.popser.alert('系统内部异常');
                        break;
                    default:
                        this.popser.alert('数据获取失败，请重试');
                        break;
                }
            }
        },()=>{
            this.popser.alert('服务器连接失败,请稍后再试');
        });
    }

    LogSave() {
        //保存日志
        // console.log(this.TrackLog);
        if (this.TrackLog.contactType == 0) {
            this.popser.alert('请选择联系方式');
            return;
        }
        if (this.TrackLog.contactType == 1 || this.TrackLog.contactType == 2) {
            if (this.TrackLog.isContacted) {
                if (!this.TrackLog.content) {
                    this.popser.alert('日志内容不能为空');
                    return;
                }
                else {
                    if (this.TrackLog.content.trim().length < 4) {
                        this.popser.alert('日志内容必须4字以上');
                        return;
                    }
                }
                if (this.TrackLog.nextAction == 2 && this.TrackLog.nextTrackDate == '') {
                    this.popser.alert('人工指定跟踪时间不能为空');
                    return;
                }
            }
            else {
                if (this.TrackLog.notContactReason == 0) {
                    this.popser.alert('请选择未联系上的原因');
                    return;
                }
                if (this.TrackLog.notContactReason == 6) {
                    if (this.TrackLog.otherNotContactReason.trim() == '') {
                        this.popser.alert('未联系上的原因不能为空');
                        return;
                    }
                    else {
                        if (this.TrackLog.otherNotContactReason.trim().length < 4) {
                            this.popser.alert('未联系上的原因必须4字以上');
                            return;
                        }
                    }
                }
                if (this.TrackLog.nextAction == 2 && this.TrackLog.nextTrackDate == '') {
                    this.popser.alert('人工指定跟踪时间不能为空');
                    return;
                }
            }
        }
        else {
            if (this.TrackLog.isContacted) {
                if (this.TrackLog.contactType == 10 && this.TrackLog.otherContactType.trim() == '') {
                    this.popser.alert('联系方式不能为空');
                    return;
                }
                if (!this.TrackLog.content) {
                    this.popser.alert('日志内容不能为空');
                    return;
                }
                else {
                    if (this.TrackLog.content.trim().length < 4) {
                        this.popser.alert('日志内容必须4字以上');
                        return;
                    }
                }
                if (this.TrackLog.nextAction == 2 && this.TrackLog.nextTrackDate == '') {
                    this.popser.alert('人工指定跟踪时间不能为空');
                    return;
                }
            }
            else {
                if (this.TrackLog.contactType == 10 && this.TrackLog.otherContactType.trim() == '') {
                    this.popser.alert('联系方式不能为空');
                    return;
                }
                if (this.TrackLog.notContactReason == 0) {
                    this.popser.alert('请选择未联系上的原因');
                    return;
                }
                if (this.TrackLog.notContactReason == 6) {
                    if (this.TrackLog.otherNotContactReason.trim() == '') {
                        this.popser.alert('未联系上的原因不能为空');
                        return;
                    }
                    else {
                        if (this.TrackLog.otherNotContactReason.trim().length < 4) {
                            this.popser.alert('未联系上的原因必须4字以上');
                            return;
                        }
                    }
                }
                if (this.TrackLog.nextAction == 2 && this.TrackLog.nextTrackDate == '') {
                    this.popser.alert('人工指定跟踪时间不能为空');
                    return;
                }
            }
        }
        this.popser.alertDIY(this.LogSaveObj, ()=>this.LogSaveCallback());
    }

    gotoBack() {//返回上一页
        this.navCtrl.pop();
    }

    nextAction(nextAction:number) {//下次跟踪的动作

        if (this.TrackLog.nextAction == nextAction) {
            return;
        }
        this.TrackLog.nextAction = nextAction;
        if (nextAction === 2) {
            this.manTrackTime = true;
        }
        else {
            this.manTrackTime = false;
        }

    }


    keyUp(event){
        AppConfig.RegExp(this.TrackLog.otherNotContactReason,event)
    }



    ionViewDidLoad() {
        //console.log(this.navCtrl.first(),this.navCtrl.getViews(),this.navCtrl.length(),this.navCtrl.getByIndex(this.navCtrl.length()-3),this.navCtrl.getPrevious(this.navCtrl.getPrevious()));
        //this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
    }



}

