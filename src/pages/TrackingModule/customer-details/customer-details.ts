import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ModalController, NavParams, ActionSheetController} from 'ionic-angular';
import {CallNumber} from 'ionic-native';
import {Content} from 'ionic-angular';
import {AppConfig}from'../../../app/app.config';
import {PopSer}from'../../../providers/pop-ser';
import {NetworkSer} from '../../../providers/network-ser';
import {InterfaceLists}from'../../../providers/interface_list';

import {CustomerStatus, TrackDateCalcType} from "../../SharedModule/enum";
import {CustomerService} from '../../SharedModule/customer.service'
import {TrackingComponent} from '../tracking/tracking';
import {LoginComponent} from '../../LoginModule/login/login';
import {ServiceMaintenancePage} from '../../SharedModule/service-maintenance/service-maintenance';
import {Customer} from "../../SharedModule/customer.model";
//import {Chart} from 'chart.js'; // 导入chart.js
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/no-data-to-display';//引入没有数据时highcharts的显示
exporting(Highcharts)
import {DateService} from '../../SharedModule/date.service';
import {CallNumberService} from '../../SharedModule/callnumber.service';
import {CallSer} from '../../../providers/call-ser';
import {notContactReasonPipe} from  '../../../pipes/notContactReasonPipe';
//declare var echarts;


@Component({
    selector: 'page-customer-details',
    templateUrl: 'customer-details.html'
})
export class CustomerDetailsComponent {
    @ViewChild("content") content: Content;
    @ViewChild('container') container: ElementRef;
    @ViewChild('lastStructContainer') lastStructContainer: ElementRef;
    @ViewChild('buyFrequencyContainer') buyFrequencyContainer: ElementRef;
    @ViewChild('trackEffect') trackEffectC: ElementRef;

    private chart: any;//总消费
    customer: Customer;
    orgid: number;//公司组织Id
    manModifyPop: number = 0;//人工管理时，从不可跟踪变成可跟踪弹窗
    manModifyPopText: string;
    manModifyTime: string;//人工管理时，从不可跟踪变成可跟踪，下次跟踪时间
    nonTrackPop: boolean = false;//不可跟踪弹窗
    remark: any;//描述不再跟踪的原因
    width: any;//获取屏幕的宽度
    isGetLastStruct: boolean;
    isGetBuyFrequency: boolean;

    //跟踪日志
    trackLog = {
        logs: [],
        pageIndex: 1,
        pageSize: 10,
        isEnd: false
    };
    //操作日志
    operateLog = {
        logs: [],
        pageIndex: 1,
        pageSize: 10,
        isEnd: false
    };
    //消费记录
    consumeOrder = {
        orders: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        isEnd: false
    };

    minDate: string;//最小下次跟踪时间
    maxDate: string;//最大下次跟踪时间

    constructor(public navCtrl: NavController,
                public modalCtrl: ModalController,
                public navParams: NavParams,
                public actionSheetCtrl: ActionSheetController,
                public popSer: PopSer,
                public networkSer: NetworkSer,
                public interfaceLists: InterfaceLists,
                public customerService: CustomerService,
                public callNumService: CallNumberService,
                public callSer: CallSer) {
        this.customer = navParams.get('customer');//从会员详情页获取到的信息
        //console.log(this.customer);
        if (this.customer.nextTrackDate) {
            this.customer.nextTrackDate = DateService.getFormatDate(this.customer.nextTrackDate);
        }
        let now = new Date();
        // if (DateService.getDateDiff(this.customer.nextTrackDate) >= 0) {
        //     this.manModifyTime = AppConfig.getLocalTime();//获取本地时间
        // }
        // else {
        //     this.manModifyTime = this.customer.nextTrackDate;
        // }
        this.minDate = AppConfig.getLocalTime();//获取本地时间
        this.maxDate = DateService.getFormatDate(new Date(now.setFullYear(now.getFullYear() + 100)).toDateString());
        this.width = AppConfig.getWindowWidth();
        //console.log(this.minDate + this.maxDate);
    }

    ionViewDidLoad() {//生命周期
        this.porocessWidth = document.getElementById("audio_process");//获取进度条节点
        this.porocessWidth.style.width = "0%";
        this.orgid = AppConfig.userInfo.orgId;//获取公司组织Id
        //this.manModifyTime = AppConfig.getLocalTime();//获取本地时间
        //console.log(this.customer);
        //从后台获取数据初始化会员画像
        this.portraitInt();
        //获取会员消费结构数据
        this.getConsumeStructure(1);
    }

    goToTracking() {
        this.navCtrl.push(TrackingComponent);
    }

    openModal(params) {
        let modal = this.modalCtrl.create(TrackingComponent, params);
        modal.present();
    }


    ionViewDidEnter() {

    }

    ngOnDestroy() {//销毁
        if (this.chart) {
            this.chart.destroy();//跟踪效果图表
        }
    }


    //拨打电话
    call(customer: any) {
        if (!customer.contactMobile) {
            this.popSer.alert(`<span class="yellow">"${customer.customerName}"</span>电话还未录入收银系统中......<wbr/>请联系管理员，将他的电话录入到收银系统中，以便及时跟踪。`, () => {
            }, true);
            return;
        }
        let callData: any = {
            title: '<div class="warm_tip text-center"><img src="img/warm.png" class="img"/></div>',
            subTitle: `即将拨打"${customer.customerName}"电话... `,
            content: '<span class="yellow">请在与会员沟通时注意保持礼节</span>',
            okText: "继续呼叫"
        };
        // 设置取消按钮的文字
        setTimeout(() => {//延迟几秒可以等html反应，这样获取的高度才准确
            let trackText = document.getElementsByClassName("btn_track")[0].getElementsByClassName("button-inner")[0];
            trackText.innerHTML = "已跟踪<small>(使用其他方式跟踪过了，直接填写跟踪日志)</small>";
        }, 3);

        let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'call_pop',
            buttons: [
                {
                    text: '普通电话',
                    cssClass: 'btn_normal',
                    handler: () => {
                        this.popSer.confirmDIY(callData, () => {
                        }, () => {
                            CallNumber.callNumber(customer.contactMobile, true).then(() => {
/*                            //获取随机测试账号
                            let cc=AppConfig.getTestCount();
                            CallNumber.callNumber(cc.number, true).then(()=> {*/
                                // console.log('success');
                                this.customerService.setUnSaveState(1, customer, AppConfig.userInfo.mobile);
                                this.navCtrl.push(TrackingComponent, {
                                    customer: customer,
                                    contactType: 1,
                                    callerPhone: AppConfig.userInfo.mobile
                                });
                            }, (error) => {
                                console.log('a: ' + error || 'error');
                            }).catch((error) => {
                                console.log('b:' + error || 'error');
                            });
                        });
                    }
                },
                {
                    text: '免费电话',
                    cssClass: 'btn_free',
                    role: 'destructive',
                    handler: () => {
                        if(AppConfig.callingType ==2){
                            this.popSer.alert(`<div class="text-center">免费通话服务不可用</br>请联系管理员开通免费通话服务</div>`);
                            return;
                        }
                        this.callSer.uxinRemainMinute().then(()=> {
                            // console.log('success');
                            this.callSer.uxinBindCall(customer).then(()=>{
                                this.customerService.setUnSaveState(2,customer,AppConfig.userInfo.mobile);
                                this.navCtrl.push(TrackingComponent, {
                                    customer: customer,
                                    contactType: 2,
                                    callerPhone:AppConfig.userInfo.mobile
                                });
                            }, (error)=> {
                                console.log('a: ' + error || 'error');
                            }).catch((error)=> {
                                console.log('b:' + error || 'error');
                            });
                        }, (error)=> {
                            console.log('a: ' + error || 'error');
                        }).catch((error)=> {
                            console.log('b:' + error || 'error');
                        });
                    }
                },
                {
                    // text: '已跟踪<small>(使用其他方式跟踪过了，直接填写跟踪日志)</small>',
                    text: '直接填写跟踪日志',
                    cssClass: 'btn_track',
                    handler: () => {
                        this.navCtrl.push(TrackingComponent, {
                            customer: customer,
                            contactType: 0
                        });
                        // console.log('已跟踪 clicked');
                    }
                },
                {
                    text: '取消',
                    cssClass: 'btn_cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    handler: () => {
                        // console.log('取消 clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    //管理方式-----------------------------------------------

    //管理方式--操作
    setManageType() {
        if (this.getTrackType() === 3) {
            this.popSer.alert("当前跟踪状态为不可跟踪,<br/>无法修改管理方式！");
            return;
        }
        let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'MemberDetailsPop',
            buttons: [
                {
                    text: '系统智能管理跟踪时间',
                    handler: () => {
                        if (this.customer.trackDateCalcType === TrackDateCalcType.Manual) {
                            this.customerService.calcNextTrackDate(this.customer.customerId).then(result => {
                                if (result.isSucceed) {
                                    // console.log(result.data);
                                    if (result.data) {
                                        let nextTrackDate = DateService.getFormatDate(result.data);
                                        this.popSer.confirm("您确定将该会员修改为系统智能管理跟踪时间？<br/>系统自动计算出的下次跟踪时间为：" + nextTrackDate, () => {
                                            this.setTrackDataCalcType(TrackDateCalcType.System,nextTrackDate);
                                        });
                                    }
                                }
                            });
                        }
                    }
                },
                {
                    text: '人工管理',
                    handler: () => {
                        if (this.customer.trackDateCalcType === TrackDateCalcType.System) {
                            /*this.popSer.confirm("您确定将该会员修改为人工管理？", ()=> {
                             this.customer.trackDateCalcType = TrackDateCalcType.Manual;
                             // this.customer.nextTrackDate= DateService.getFormatDate(new Date());//选为人工管理时，下次跟踪时间自动更新为今日
                             this.setTrackDataCalcType();
                             });*/
                            this.manModifyPop = 2;//打开弹窗
                            this.manModifyPopText = "您确定将该会员修改为人工管理？";
                            if (DateService.getDateDiff(this.customer.nextTrackDate) >=0) {
                                this.manModifyTime = AppConfig.getLocalTime();//获取本地时间
                            }
                            else {
                                this.manModifyTime = DateService.getFormatDate(this.customer.nextTrackDate);
                            }
                        }

                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        //console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();
    }

    //设置跟踪时间计算方式接口
    setTrackDataCalcType(trackDateCalcType,nextTrackDate) {//设置跟踪时间计算方式接口
        return this.interfaceLists.settrackdatecalctype({
            orgId: this.orgid,
            customerId: this.customer.customerId,
            trackDateCalcType: trackDateCalcType,
            nextTrackDate: nextTrackDate
        }).then((data)=>{
            if(data.isSucceed){
                this.customer.trackDateCalcType = trackDateCalcType;
                this.customer.nextTrackDate = nextTrackDate;
            }else {
                this.popSer.alert("设置失败，请稍后再试");
            }
        },(err)=>{
            console.log(err);
            this.popSer.alert("服务器连接失败，请稍后再试");
        });
        //return this.setTrackDataCalcTypeSlow();
    }

    //模拟数据
    setTrackDataCalcTypeSlow(): Promise<any> {
        let result = {
            isSucceed: true,
            data: {}
        };
        return new Promise<any>(resolve =>
            setTimeout(resolve, 500))
            .then(() => Promise.resolve(result));
    }

    //是否可跟踪-----------------------------------

    //关闭管理方式为人工时，从不可跟踪变为可跟踪的弹窗
    manModifyPopClose() {//关闭管理方式为人工时，从不可跟踪变为可跟踪的弹窗
        this.manModifyPop = 0;
    }

    manModifyOk() {//人工管理，不可跟踪变成可跟踪，下次跟踪时间
        if (this.manModifyPop == 1) {
            this.settrackTime(this.manModifyTime,()=>{
                this.customer.nextTrackDate = this.manModifyTime;
                this.customer.status = CustomerStatus.Track;
            });
        }
        if (this.manModifyPop == 2) {
            this.setTrackDataCalcType(TrackDateCalcType.Manual,this.manModifyTime);
        }
        if (this.manModifyPop == 3) {

            this.settrackTime(this.manModifyTime,()=>{
                this.customer.trackDateCalcType = TrackDateCalcType.Manual;
                // this.customer.nextTrackDate= DateService.getFormatDate(new Date());//选为人工管理时，下次跟踪时间自动更新为今日
                this.customer.nextTrackDate = this.manModifyTime;
            });

        }
        this.manModifyPop = 0;
    }


    //不可跟踪 -》可跟踪，获取客户下一次跟踪时间接口
    SystemModifyTime() {
        this.customerService.calcNextTrackDate(this.customer.customerId).then(result => {
            if (result.isSucceed) {
                // console.log(result.data);
                if (result.data) {
                    this.settrackTime(result.data,()=>{
                        this.customer.nextTrackDate = DateService.getFormatDate(result.data);
                        this.customer.status = CustomerStatus.Track;
                    });
                }
            }
            else {
                let error = {
                    function: 'SystemModifyTime',
                    userName: AppConfig.userName,
                    logLevel: 8,
                    code: result.code,
                    message: result.msg,
                    module: 'TrackingModule',
                    source: 'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
        }, err => {
            let error = {
                function: 'SystemModifyTime',
                userName: AppConfig.userName,
                logLevel: 16,
                code: 0,
                message: err.toString(),
                module: 'TrackingModule',
                source: 'customer-details.ts'
            };
            this.customerService.writeError(error);
        });
    }

    //不再跟踪弹窗关闭
    nonTrackPopClose() {
        this.nonTrackPop = false;
    }

//关闭会员跟踪接口，不再跟踪弹窗，确认按钮
    nonTrackPopOk() {
        if (this.remark) {
            this.nonTrackPop = false;
            this.customer.status = CustomerStatus.UnTrack;
            this.customer.nextTrackDate = "";//清空下次跟踪时间
            this.interfaceLists.disabledtracking({
                orgId: this.orgid,
                customerId: this.customer.customerId,
                remark: this.remark
            }).then(result => {
                if (result.isSucceed) {
                    this.customerService.removeCustomerById(this.customer.customerId);
                }
            });
            this.remark = "";//为何清空remark
        }
        else {
            this.popSer.alert("您还没输入不可跟踪的理由呢~");
        }

    }

    //下次跟踪时间--------------------------

    //设置下次跟踪时间接口
    settrackTime(nextTrackDate: any,callback:any = ()=> {}) {//设置下次跟踪时间接口
        this.interfaceLists.settracking({
            orgId: this.orgid,
            customerId: this.customer.customerId,
            nextTrackDate: nextTrackDate
        }).then((returnData)=>{
            if (!returnData.isSucceed) {
                this.popSer.alert('下次跟踪时间设置失败');
            }else {
                if (callback != undefined && callback != null && typeof callback == 'function') {
                    callback();
                }
            }
        },()=>{
            this.popSer.alert('设置下次跟踪时间时服务器连接失败，请稍后再试');
        });
    }

    //弹窗---------------------------------------

    //会员状态--可跟踪不可跟踪
    setTrackStatus() {
        let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'MemberDetailsPop',
            buttons: [
                {
                    text: '可跟踪',
                    handler: () => {
                        if (this.customer.status === CustomerStatus.UnTrack) {//不可跟踪改为可跟踪
                            if (this.customer.trackDateCalcType === TrackDateCalcType.System) {//系统管理
                                this.popSer.confirm("您确定将该会员修改可跟踪？", () => this.SystemModifyTime());
                            }
                            else {//人工
                                this.manModifyPop = 1;//打开弹窗
                                this.manModifyPopText = "您正在将该会员修改为可跟踪，";
                                if (DateService.getDateDiff(this.customer.nextTrackDate) >=0) {
                                    this.manModifyTime = AppConfig.getLocalTime();//获取本地时间
                                }
                                else {
                                    this.manModifyTime = DateService.getFormatDate(this.customer.nextTrackDate);
                                }
                            }
                        }

                    }
                },
                {
                    text: '不可跟踪',
                    handler: () => {
                        if (this.customer.status === CustomerStatus.Track) {//可跟踪改为不可跟踪
                            this.nonTrackPop = true;
                            let element = document.getElementById('unTrackReason');
                            if (element) {
                                let timeoutId = setTimeout(() => {
                                    document.getElementById('unTrackReason').focus();
                                    clearTimeout(timeoutId);
                                }, 0);
                            }
                        }
                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });
        actionSheet.present();
    }


    //下次跟踪点击函数
    NextTrack() {
        if (this.getTrackType() === 1) {
            /*this.popSer.confirm("手动修改下次跟踪时间，<br/>管理方式将变更为人工管理", ()=> {
             this.customer.trackDateCalcType = TrackDateCalcType.Manual;
             // this.customer.nextTrackDate= DateService.getFormatDate(new Date());//选为人工管理时，下次跟踪时间自动更新为今日
             this.setTrackDataCalcType();
             });*/
            this.manModifyPop = 3;//打开弹窗
            this.manModifyPopText = "手动修改下次跟踪时间，管理方式将变更为人工管理。";
            if (DateService.getDateDiff(this.customer.nextTrackDate) >= 0) {
                this.manModifyTime = AppConfig.getLocalTime();//获取本地时间
            }
            else {
                this.manModifyTime = DateService.getFormatDate(this.customer.nextTrackDate);
            }
        }
        if (this.getTrackType() === 3) {
            this.popSer.alert("当前跟踪状态为不可跟踪,<br/>无法选择下次跟踪时间！");
        }
    }

    //下次跟踪显示文本
    getTrackType() {
        //不可跟踪
        if (this.customer.status === CustomerStatus.UnTrack) {
            return 3;
        }
        else {
            //系统托管，可跟踪
            if (this.customer.trackDateCalcType === TrackDateCalcType.System && this.customer.status === CustomerStatus.Track) {
                return 1;
            }
            //人工管理，可跟踪
            if (this.customer.trackDateCalcType === TrackDateCalcType.Manual && this.customer.status === CustomerStatus.Track) {
                return 2;
            }
        }
    }


    //获取会员消费结构数据
    load:any=0;
    getConsumeStructure(structType: number) {
        let param = {
            orgId: this.orgid,
            customerId: this.customer.customerId,
            structType: structType
        };
        this.customerService.getConsumeStructure(param).then((result) => {
            if (result.isSucceed) {
                if (result.data) {
                    let struct = {
                        structType: structType,
                        container: {},
                        data: []
                    };
                    switch (structType) {
                        case 1:
                            if (result.data.overallStruct) {
                                result.data.overallStruct.sort((param1, param2) => param2.totalAmount - param1.totalAmount);
                                struct.container = this.container;
                                for (let i = 0; i < result.data.overallStruct.length; i++) {
                                    struct.data.push({
                                        name: result.data.overallStruct[i].className,
                                        value: result.data.overallStruct[i].totalAmount
                                    });
                                }
                            }
                            break;
                        case 2:
                            if (result.data.lastStruct) {
                                result.data.lastStruct.sort((param1, param2) => param2.totalAmount - param1.totalAmount);
                                struct.container = this.lastStructContainer;
                                for (let i = 0; i < result.data.lastStruct.length; i++) {
                                    struct.data.push({
                                        name: result.data.lastStruct[i].className,
                                        value: result.data.lastStruct[i].totalAmount
                                    });
                                }
                                this.isGetLastStruct = true;
                            }
                            break;
                        case 3:
                            if (result.data.buyFrequency) {
                                //按时间倒序排列
                                result.data.buyFrequency.sort((param1, param2) => param2.month - param1.month);
                                struct.container = this.buyFrequencyContainer;
                                for (let i = 0; i < result.data.buyFrequency.length; i++) {
                                    struct.data.push({
                                        name: result.data.buyFrequency[i].month,
                                        value: result.data.buyFrequency[i].times
                                    });
                                }
                                this.isGetBuyFrequency = true;
                            }
                            break;
                        case 4:
                            if (result.data.resultStruct) {
                                let count = 0;//用于value出现0的次数
                                result.data.resultStruct.sort((param1, param2) => param1.code - param2.code);
                                struct.container = this.trackEffectC;
                                for (let i = 0; i < result.data.resultStruct.length; i++) {
                                    struct.data.push({
                                        name: result.data.resultStruct[i].name,
                                        value: result.data.resultStruct[i].times
                                    });
                                    if (result.data.resultStruct[i].times === 0) {
                                        count++;
                                    }
                                }
                                if (count === 3) {
                                    struct.data = [];
                                }
                            }
                            break;
                    }
                    this.StructHchart(struct);
                    this.load=2;
                }
            }
            else {
                let error = {
                    function: 'getConsumeStructure',
                    userName: AppConfig.userName,
                    logLevel: 8,
                    code: result.code,
                    message: result.msg,
                    module: 'TrackingModule',
                    source: 'customer-details.ts'
                };
                this.customerService.writeError(error);
                switch (result.code) {
                    case 600:   //600跳转到系统维护
                        this.navCtrl.push(ServiceMaintenancePage);
                        break;
                    case 400:
                        this.popSer.alert('请求不合法（请求安全校验没有通过）');
                        break;
                    case 401:
                        this.popSer.alert('请求要求身份验证（TOKEN无效）');
                        // this.navCtrl.push(LoginComponent);
                        this.navCtrl.parent.parent.setRoot(LoginComponent);
                        break;
                    case 500:
                        this.popSer.alert('系统内部异常');
                        break;
                    default:
                        this.popSer.alert('数据获取失败，请重试');
                        break;
                }
                this.load=1;
            }
        }, err => {
            let error = {
                function: 'getConsumeStructure',
                userName: AppConfig.userName,
                logLevel: 16,
                code: 0,
                message: err.toString(),
                module: 'TrackingModule',
                source: 'customer-details.ts'
            };
            this.customerService.writeError(error);
            this.load=1;
        });

    }

    //消费结构图表样式切换
    figure: number = 1;//消费结构图表样式切换参数
    echartSelect(n) {//消费结构图表样式切换
        if (n == 2 && !this.isGetLastStruct || n == 3 && !this.isGetBuyFrequency) {
            this.getConsumeStructure(n);
        }
        this.figure = n;
    }

    //对图表数据进行初始化，最多只显示6种种类，多于时，显示最高的六种种类，剩余的都合并成其他类型
    HchartInt(struct) {
        let data = [];
        if (struct.data.length !== 0) {
            let color = struct.structType == 4 ? ['#CCCCCC', '#18A0E5', '#FFC000'] : ['#18A0E5', '#AD5EDB', '#32B16C', '#1764C1', '#F05C5C', '#FFC000', '#CCCCCC'];
            let value: number = 0;
            //对数据进行处理
            for (let i = 0; i < struct.data.length; i++) {
                //当数据长度小于6位时
                if (i < 6) {
                    data.push(
                        {
                            name: struct.data[i].name,
                            y: struct.data[i].value,
                            color: color[i]
                        }
                    );
                }
                else {
                    value += struct.data[i].value;
                    if (i === (struct.data.length - 1)) {
                        data.push(
                            {
                                name: "其他",
                                y: value,
                                color: color[6]

                            }
                        );
                    }
                }
            }
        }
        return data;
    }


    //结构图表，总消费结构、上次购买结构、购买频次
    StructHchart(struct) {
        let data = this.HchartInt(struct);
        let opts: any = {
            lang: {
                // Custom language option
                noData: "<div class='chart-no-data'><img src='img/non_record.png' class='img'/><p class='p1'>暂无数据</p></div>"
            },
            noData: {
                useHTML: true
            },
            chart: {
                renderTo: struct.container.nativeElement
            },
            credits: {
                enabled: false // 禁用版权信息
            },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: struct.structType == 4 ? '{point.y}次' : '{point.y}'
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                floating: true,
                itemStyle: {
                    fontWeight: 'normal',
                    color: '#959595',
                    lineHeight: struct.structType == 4 ? 0 : 3
                },
                itemMarginTop: struct.structType == 4 ? 0 : 10,
                symbolRadius: 0,
                squareSymbol: struct.structType == 4 ? false : true
            },
            plotOptions: {//数据列配置，全局配置
                pie: {
                    allowPointSelect: true,
                    size: "75%",//饼图大小
                    slicedOffset: 5,
                    center: struct.structType == 4 ? [] : ["50%", "40%"],
                    dataLabels: {//标签里的字
                        enabled: true,
                        distance: -24,//标签显示的字距离饼图的距离
                        inside: true,
                        format: struct.structType == 4 ? '{y}次' : '{y}',
                        style: {
                            fontWeight: 'normal',
                            color: 'white',
                            fontSize: 12,
                            textShadow: struct.structType == 4 ? '0px 0px 0px white' : '0px 0px 0px #255255'
                        }
                    },
                    showInLegend: true//饼图的图例是在这里设置的
                }
            },
            series: [{
                type: 'pie',
                name: struct.structType == 4 ? '跟踪效果' : '',
                innerSize: '50%',//设置里面的小环
                data: data
            }]
        };

        this.chart = new Highcharts.Chart(opts);
        // console.dir( this.chart);


    }


    //初始化会员画像数据，没有数据则显示“--”
    portraitData = {
        likeBrandName: '--',//会员喜欢的品牌
        likeClassName: '--',//会员喜欢的分类
        totalPurchaseAmount: '--',//总消费金额
        totalPurchaseTimes: '--',//总购买次数
        PCT: '--',                //客单价
        lastPurchaseDate: '',  //最近消费时间
        notConsumeDays: '--',    //距上次消费天数
        lastConsumeAmount: '--', //最近消费金额
        lastConsumeQty: '--', //最近购买商品件数
        checkInDate: '',      //登记时间
        checkInStore: '--',    //登记门店
        checkInOperator: '--',  //登记人员
        lastBuyStoreName: '--',    //最后购买门店名称
        lastMonthBuyTimes: '--',  //本月购买次数
        score: '--'           //积分分数

    };

    spillOver = {
        over: false,
        show: false
    };


    overflow() {
        if (this.spillOver.over) {
            this.spillOver.show = !this.spillOver.show;
        }
    }

    //会员画像--获取数据，数据初始化
    portraitInt() {
        this.customerService.getCustomerPortrait(this.customer.customerId).then((result) => {
            if (result.isSucceed) {
                //console.log(result.data);
                if (result.data) {
                    if(result.data.PCT && result.data.PCT!=''){
                        result.data.PCT = (result.data.PCT).toFixed(2);
                    }
                    this.portraitData = result.data;
                    if (this.portraitData.likeBrandName.length !== 0) {
                        if (this.portraitData.likeBrandName.length > 9) {
                            this.spillOver.over = true;
                        }
                        else {
                            this.spillOver.over = false;
                        }
                    }

                }
            }
            else {
                let error = {
                    function: 'portraitInt',
                    userName: AppConfig.userName,
                    logLevel: 8,
                    code: result.code,
                    message: result.msg,
                    module: 'TrackingModule',
                    source: 'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
            //获取消费记录
            this.getConsumeOrder();
        }, err => {
            let error = {
                function: 'portraitInt',
                userName: AppConfig.userName,
                logLevel: 16,
                code: 0,
                message: err.toString(),
                module: 'TrackingModule',
                source: 'customer-details.ts'
            };
            this.customerService.writeError(error);
        });

    }

    //消费记录-------------------------------------------


    //获取会员购买记录
    getConsumeOrder() {
        let param = {
            orgId: this.orgid,
            customerId: this.customer.customerId,
            pageSize: this.consumeOrder.pageSize,
            pageIndex: this.consumeOrder.pageIndex++
        };
        //console.log(param);
        this.customerService.getConsumeOrder(param).then((result) => {
            if (result.isSucceed) {
                // console.log(result.data);
                if (!result.data) result.data = [];
                if (result.data.length <= 0) {
                    this.consumeOrder.isEnd = true;
                }
                else {
                    if (result.data.length < param.pageSize) {
                        this.consumeOrder.isEnd = true;
                    }
                    else {
                        this.consumeOrder.isEnd = false;
                    }
                }
                for (let i = 0; i < result.data.length; i++) {
                    this.consumeOrder.orders.push(result.data[i]);
                }
            }
            else {
                let error = {
                    function: 'getConsumeOrder',
                    userName: AppConfig.userName,
                    logLevel: 8,
                    code: result.code,
                    message: result.msg,
                    module: 'TrackingModule',
                    source: 'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
            if (param.pageIndex == 1) {
                this.getConsumeStructure(4);
                this.getTrackLog();
            }
        }, err => {
            let error = {
                function: 'getConsumeOrder',
                userName: AppConfig.userName,
                logLevel: 16,
                code: 0,
                message: err.toString(),
                module: 'TrackingModule',
                source: 'customer-details.ts'
            };
            this.customerService.writeError(error);
        });

    }

    //滚动到查看消费记录
    scrollToTop() {
        this.content.scrollTo(0, 755);
    }

    //跟踪日志-------------------------------------------

    //跟踪日志与操作日志选择切换
    LogSelect: number = 1;

    logSelect(name) {
        if (name == 2 && this.operateLog.pageIndex == 1) {
            this.getOperateLog();
        }
        this.LogSelect = name;
    }


    //跟踪日志接口--获取数据，数据初始化
    getTrackLog() {
        let param = {
            orgId: this.orgid,
            customerId: this.customer.customerId,
            employeeId: AppConfig.userInfo.userId,
            searchName: '',
            trackResult: 0,
            pageSize: this.trackLog.pageSize,
            pageIndex: this.trackLog.pageIndex++
        };
        //console.log(param);
        //alert(param.pageIndex);
        this.customerService.getTrackLog(param).then((result) => {
            if (result.isSucceed) {
                // console.log(result);
                if (!result.data) result.data = [];
                if (result.data.length <= 0) {
                    this.trackLog.isEnd = true;
                }
                else {
                    if (result.data.length < param.pageSize) {
                        this.trackLog.isEnd = true;
                    }
                    else {
                        this.trackLog.isEnd = false;
                    }
                }
                for (let i = 0; i < result.data.length; i++) {
                    result.data[i].audio_is_play = false;  //音频在播放
                    this.trackLog.logs.push(result.data[i]);
                }
            }
            else {
                let error = {
                    function: 'getTrackLog',
                    userName: AppConfig.userName,
                    logLevel: 8,
                    code: result.code,
                    message: result.msg,
                    module: 'TrackingModule',
                    source: 'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
        }, err => {
            let error = {
                function: 'getTrackLog',
                userName: AppConfig.userName,
                logLevel: 16,
                code: 0,
                message: err.toString(),
                module: 'TrackingModule',
                source: 'customer-details.ts'
            };
            this.customerService.writeError(error);
        });

    }

    //购买详情
    toggleDetail(log) {
        // console.log(log);
        log.showDetail = !log.showDetail;
    }


    //操作日志-----------------------------------------


    //操作日志接口--获取数据，数据初始化
    getOperateLog() {
        let param = {
            orgId: this.orgid,
            customerId: this.customer.customerId,
            pageSize: this.operateLog.pageSize,
            pageIndex: this.operateLog.pageIndex++
        };
        // console.log('getOperateLog', param);
        this.customerService.getOperateLog(param).then((result) => {
            if (result.isSucceed) {
                // console.log(result.data);
                if (!result.data) result.data = [];
                if (result.data.length <= 0) {
                    this.operateLog.isEnd = true;
                }
                else {
                    if (result.data.length < param.pageSize) {
                        this.operateLog.isEnd = true;
                    }
                    else {
                        this.operateLog.isEnd = false;
                    }
                }
                for (let i = 0; i < result.data.length; i++) {
                    this.operateLog.logs.push(result.data[i]);
                }
            }
            else {
                let error = {
                    function: 'getOperateLog',
                    userName: AppConfig.userName,
                    logLevel: 8,
                    code: result.code,
                    message: result.msg,
                    module: 'TrackingModule',
                    source: 'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
        }, err => {
            let error = {
                function: 'getOperateLog',
                userName: AppConfig.userName,
                logLevel: 16,
                code: 0,
                message: err.toString(),
                module: 'TrackingModule',
                source: 'customer-details.ts'
            };
            this.customerService.writeError(error);
        });

    }

    goBack() {
        this.navCtrl.pop();
    }


    /*
     语音播放
     */
    //语音
    porocessWidth: any = "";//获取进度条节点
    // porocessWidth:any="0%";//获取进度条节点
    // porocessWidth.style.width= "0%";
    interval = setInterval(function () {
    }, 1000);//循环器
    //语音播放框
    show_audio: any = {
        is_show: false,	//弹窗的显示
        all_time_length: 0,	//总时长
        played_time: 0,		//已经播放的时长
        src: '',//现在播放的音频的src
        logId: '',//现在播放的音频的id
        audiPlayIcon: 'img/grey_play.png',//图标
        currObject: null    //上一个音频对象
    };
    //语音播放入口1
    audioplay1(log) {
        this.show_audio.is_show = true;
        if (log.logId != this.show_audio.logId) {//换了一段新的音频
            this.porocessWidth.style.width = "0%";
            if (this.show_audio.currObject != null && this.show_audio.currObject != undefined) {
                var obj = this.show_audio.currObject;
                if (obj != null) obj.audio_is_play = false;
            }
            this.show_audio.all_time_length = log.trackDetail.voiceRecordSize;
            this.show_audio.played_time = 0;
            this.show_audio.src = log.trackDetail.voiceRecordUrl;
            this.show_audio.logId = log.logId;
            this.show_audio.currObject = log;
            log.audio_is_play = true;
        }
        this.audioplay2();
    }

    //语音播放入口2
    audioplay2() {
        // console.log('img');
        event.preventDefault();
        let audio: any = window.document.getElementById("audio");//获取音频节点
        setTimeout(() => {
            // this.show_audio.all_time_length = audio.duration;
            if (audio.paused) {
                audio.play();
                this.show_audio.audiPlayIcon = 'img/yellow_play.png';
                this.show_audio.currObject.audio_is_play = true;
                this.interval = setInterval(() => {
                    this.show_audio.played_time = audio.currentTime;
                    this.porocessWidth.style.width = Math.round(audio.currentTime) / Math.round(audio.duration) * 100 + '%';
                    // this.porocessWidth=Math.round(audio.currentTime)/Math.round(audio.duration)*100 +'%';
                    // console.log('aaa');
                    if (audio.ended) {
                        this.show_audio.audiPlayIcon = 'img/grey_play.png';
                        this.show_audio.currObject.audio_is_play = false;
                        window.clearInterval(this.interval);
                    }
                }, 1000);
            } else {
                window.clearInterval(this.interval);
                this.show_audio.audiPlayIcon = 'img/grey_play.png';
                this.show_audio.currObject.audio_is_play = false;
                audio.pause();
            }
        },)
    }

    //关闭语音播放框
    audio_close() {
        window.clearInterval(this.interval);
        this.show_audio.currObject.audio_is_play = false;
        this.show_audio = {
            is_show: false,	//弹窗的显示
            all_time_length: 0,	//总时长
            played_time: 0,		//已经播放的时长
            src: '',//现在播放的音频的src
            logId: '',//现在播放的音频的id
            audiPlayIcon: 'img/grey_play.png',//图标
            currObject: null    //上一个音频对象
        }
    }

}
