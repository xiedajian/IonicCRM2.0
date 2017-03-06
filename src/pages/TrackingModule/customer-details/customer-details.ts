import { Component , ViewChild, ElementRef} from '@angular/core';
import { NavController,ModalController,NavParams,ActionSheetController  } from 'ionic-angular';
import {CallNumber} from 'ionic-native';
import { Content } from 'ionic-angular';
import {AppConfig}from'../../../app/app.config';
import {HttpSer}from'../../../providers/http-ser';
import {PopSer}from'../../../providers/pop-ser';
import {InterfaceLists}from'../../../providers/interface_list';

import {CustomerStatus,TrackDateCalcType} from "../../SharedModule/enum";
import {CustomerService} from '../../SharedModule/customer.service'
import {TrackingComponent} from '../tracking/tracking';
import {Customer} from "../../SharedModule/customer.model";
//import {Chart} from 'chart.js'; // 导入chart.js
import * as Highcharts from 'highcharts';
import {DateService} from '../../SharedModule/date.service';
import {CallNumberService} from '../../SharedModule/callnumber.service';
//declare var echarts;


@Component({
  selector: 'page-customer-details',
  templateUrl: 'customer-details.html'
})
export class CustomerDetailsComponent {
    @ViewChild("content") content:Content;
    @ViewChild('container') container:ElementRef;
    @ViewChild('lastStructContainer') lastStructContainer:ElementRef;
    @ViewChild('buyFrequencyContainer') buyFrequencyContainer:ElementRef;
    @ViewChild('trackEffect') trackEffectC:ElementRef;

    private chart:any;//总消费
    customer:Customer;
    orgid:number;//公司组织Id
    manModifyPop:boolean = false;//人工管理时，从不可跟踪变成可跟踪弹窗
    manModifyTime:string;//人工管理时，从不可跟踪变成可跟踪，下次跟踪时间
    nonTrackPop:boolean = false;//不可跟踪弹窗
    remark:any;//描述不再跟踪的原因
    width:any;//获取屏幕的宽度
    isGetLastStruct:boolean;
    isGetBuyFrequency:boolean;

    //跟踪日志
    trackLog = {
        logs: [],
        pageIndex: 1,
        pageSize: 2,
        isEnd: false
    };
    //操作日志
    operateLog = {
        logs: [],
        pageIndex: 1,
        pageSize: 2,
        isEnd: false
    };
    //消费记录
    consumeOrder = {
        orders: [],
        total: 0,
        pageIndex: 1,
        pageSize: 2,
        isEnd: false
    };

    minDate:string;//最小下次跟踪时间
    maxDate:string;//最大下次跟踪时间

    constructor(public navCtrl:NavController,
                public modalCtrl:ModalController,
                public navParams:NavParams,
                public actionSheetCtrl:ActionSheetController,
                public popSer:PopSer,
                public interfaceLists:InterfaceLists,
                public customerService:CustomerService,
                public callNumService:CallNumberService) {
        this.customer = navParams.get('customer');//从会员详情页获取到的信息
        //console.log(this.customer);
        if (this.customer.nextTrackDate) {
            this.customer.nextTrackDate = DateService.getFormatDate(new Date(this.customer.nextTrackDate));
        }
        let now = new Date();
        if (DateService.getDateDiff(new Date(this.customer.nextTrackDate)) > 0) {
            this.minDate = this.customer.nextTrackDate;
        }
        else {
            this.minDate = DateService.getFormatDate(now);//下一次跟踪时间
        }
        this.maxDate = DateService.getFormatDate(new Date(now.setFullYear(now.getFullYear() + 100)));
        console.log(this.customer);
        this.width = AppConfig.getWindowWidth();
        //console.log("this.width" + this.width);
    }

    ionViewDidLoad() {//生命周期
        this.orgid = AppConfig.userInfo.orgId;//获取公司组织Id
        this.manModifyTime = AppConfig.getLocalTime();//获取本地时间
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
        this.chart.destroy();//跟踪效果图表
    }


    //拨打电话
    call(customer:any) {
        if (!customer.contactMobile) {
            this.popSer.alert(`<span class="yellow">"${customer.customerName}"</span>电话还未录入收银系统中......<br/>请联系管理员，将他的电话录入到收银系统中，以便及时跟踪。`);
            return;
        }
        let callData:any ={
            title:'<div class="warm_tip text-center"><img src="img/warm.png" class="img"/></div>',
            subTitle:"12136",
            content:'<span class="yellow">45545455</span>',
            okText:"继续呼叫"
        };

        let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'call_pop',
            buttons: [
                {
                    text: '免费电话',
                    cssClass: 'btn_free',
                    role: 'destructive',
                    handler: () => {
                        console.log('免费电话 clicked');
                        this.navCtrl.push(TrackingComponent, {
                            customer: customer,
                            contactType: 1,
                            callerPhone:AppConfig.userInfo.mobile
                        });
                    }
                },
                {
                    text: '普通电话',
                    cssClass: 'btn_normal',
                    handler: () => {
                        console.log('普通电话 clicked');
                        this.popSer.confirmDIY(callData,()=>{},()=>{
                            this.customerService.setUnSaveState(2,customer,AppConfig.userInfo.mobile);
                            this.navCtrl.push(TrackingComponent, {
                                customer: customer,
                                contactType: 2,
                                callerPhone:AppConfig.userInfo.mobile
                            });
                            /*CallNumber.callNumber(customer.contactMobile, true).then(()=> {
                                console.log('success');
                                alert('success');
                                //
                                this.customerService.setUnSaveState(2,customer);
                                this.navCtrl.push(TrackingComponent, {
                                    customer: customer,
                                    contactType: 2
                                });
                            }, (error)=> {
                                alert('a: ' + error || 'error');
                            }).catch((error)=> {
                                console.log(error || 'error');
                                alert('b:' + error || 'error');
                            });*/
                        });
                    }
                },
                {
                    text: '已跟踪<small>(使用其他方式跟踪过了，直接填写跟踪日志)</small>',
                    cssClass: 'btn_track',
                    handler: () => {
                        this.navCtrl.push(TrackingComponent, {
                            customer: customer,
                            contactType: 0
                        });
                        console.log('已跟踪 clicked');
                    }
                },
                {
                    text: '取消',
                    cssClass: 'btn_cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    handler: () => {
                        console.log('取消 clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    //管理方式-----------------------------------------------

    //管理方式--操作
    setManageType() {
        let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'MemberDetailsPop',
            buttons: [
                {
                    text: '系统智能管理跟踪时间',
                    handler: () => {
                        if (this.customer.trackDateCalcType === TrackDateCalcType.Manual) {
                            this.popSer.confirm("您确定将该会员修改为系统智能管理跟踪时间？", ()=> {
                                this.customer.trackDateCalcType = TrackDateCalcType.System;
                                this.setTrackDataCalcType();
                            });
                        }
                    }
                },
                {
                    text: '人工管理',
                    handler: () => {
                        if (this.customer.trackDateCalcType === TrackDateCalcType.System) {
                            this.popSer.confirm("您确定将该会员修改为人工管理？", ()=> {
                                this.customer.trackDateCalcType = TrackDateCalcType.Manual;
                                this.setTrackDataCalcType();
                            });
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
    setTrackDataCalcType() {//设置跟踪时间计算方式接口
        /*return this.interfaceLists.settrackdatecalctype({
         orgId: this.orgid,
         customerId: this.customer.customerId,
         trackDateCalcType: this.customer.trackDateCalcType
         });*/
        return this.setTrackDataCalcTypeSlow();
    }

    //模拟数据
    setTrackDataCalcTypeSlow():Promise<any> {
        let result = {
            isSucceed: true,
            data: {}
        };
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>Promise.resolve(result));
    }

    //是否可跟踪-----------------------------------

    //关闭管理方式为人工时，从不可跟踪变为可跟踪的弹窗
    manModifyPopClose() {//关闭管理方式为人工时，从不可跟踪变为可跟踪的弹窗
        this.manModifyPop = false;
    }

    manModifyOk() {//人工管理，不可跟踪变成可跟踪，下次跟踪时间
        this.manModifyPop = false;
        this.customer.nextTrackDate = this.manModifyTime;
        this.customer.status = CustomerStatus.Track;
        this.settrackTime();
    }


    //不可跟踪 -》可跟踪，获取客户下一次跟踪时间接口
    SystemModifyTime() {
        this.customerService.calcNextTrackDate(this.customer.customerId).then(result=> {
            if (result.isSucceed) {
                console.log(result.data);
                if(result.data) {
                    this.customer.nextTrackDate = DateService.getFormatDate(new Date(result.data));
                    this.customer.status = CustomerStatus.Track;
                    this.settrackTime();
                }
            }
            else {
                let error={
                    function:'SystemModifyTime',
                    userName:AppConfig.userName,
                    logLevel:8,
                    code:result.code,
                    message:result.msg,
                    module:'TrackingModule',
                    source:'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
        },err=>{
            let error={
                function:'SystemModifyTime',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err.toString(),
                module:'TrackingModule',
                source:'customer-details.ts'
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
            });
            this.remark = "";//为何清空remark
        }
        else {
            this.popSer.alert("您还没输入不可跟踪的理由呢~");
        }

    }

    //下次跟踪时间--------------------------

    //设置下次跟踪时间接口
    settrackTime() {//设置下次跟踪时间接口
        this.interfaceLists.settracking({
            orgId: this.orgid,
            customerId: this.customer.customerId,
            nextTrackDate: this.customer.nextTrackDate
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
                                this.popSer.confirm("您确定将该会员修改可跟踪？", ()=>this.SystemModifyTime());
                            }
                            else {//人工
                                this.manModifyPop = true;//打开弹窗
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
            this.popSer.confirm("手动修改下次跟踪时间，管理方式将变更为人工管理", ()=> {
                this.customer.trackDateCalcType = TrackDateCalcType.Manual;
                this.setTrackDataCalcType();
            });
        }
        if (this.getTrackType() === 3) {
            this.popSer.alert("当前跟踪状态为不可跟踪，无法选择下次跟踪时间！");
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
    getConsumeStructure(structType:number) {
        let param = {
            orgId: this.orgid,
            customerId: this.customer.customerId,
            structType:structType
        };
        this.customerService.getConsumeStructure(param).then((result)=> {
            if (result.isSucceed) {
                if(result.data){
                    let struct={
                        structType:structType,
                        container:{},
                        data:[]
                    };
                    switch (structType){
                        case 1:
                            if(result.data.overallStruct){
                                result.data.overallStruct.sort((param1, param2)=>param2.totalAmount-param1.totalAmount);
                                struct.container=this.container;
                                for(let i=0;i<result.data.overallStruct.length;i++){
                                    struct.data.push({name:result.data.overallStruct[i].className,value:result.data.overallStruct[i].totalAmount});
                                }
                            }
                            break;
                        case 2:
                            if(result.data.lastStruct){
                                result.data.lastStruct.sort((param1, param2)=>param2.totalAmount-param1.totalAmount);
                                struct.container=this.lastStructContainer;
                                for(let i=0;i<result.data.lastStruct.length;i++){
                                    struct.data.push({name:result.data.lastStruct[i].className,value:result.data.lastStruct[i].totalAmount});
                                }
                                this.isGetLastStruct=true;
                            }
                            break;
                        case 3:
                            if(result.data.buyFrequency){
                                result.data.buyFrequency.sort((param1, param2)=>param2.times-param1.times);
                                struct.container=this.buyFrequencyContainer;
                                for(let i=0;i<result.data.buyFrequency.length;i++){
                                    struct.data.push({name:result.data.buyFrequency[i].month,value:result.data.buyFrequency[i].times});
                                }
                                this.isGetBuyFrequency=true;
                            }
                            break;
                        case 4:
                            if(result.data.resultStruct){
                                result.data.resultStruct.sort((param1, param2)=>param1.code-param2.code);
                                struct.container=this.trackEffectC;
                                for(let i=0;i<result.data.resultStruct.length;i++){
                                    struct.data.push({name:result.data.resultStruct[i].name,value:result.data.resultStruct[i].times});
                                }
                            }
                            break;
                    }
                    this.StructHchart(struct);
                }
            }
            else {
                let error={
                    function:'getConsumeStructure',
                    userName:AppConfig.userName,
                    logLevel:8,
                    code:result.code,
                    message:result.msg,
                    module:'TrackingModule',
                    source:'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
        },err=>{
            let error={
                function:'getConsumeStructure',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err.toString(),
                module:'TrackingModule',
                source:'customer-details.ts'
            };
            this.customerService.writeError(error);
        });

    }

    //消费结构图表样式切换
    figure:number = 1;//消费结构图表样式切换参数
    echartSelect(n) {//消费结构图表样式切换
        if(n==2 && !this.isGetLastStruct || n==3 && !this.isGetBuyFrequency) {
            this.getConsumeStructure(n);
        }
        this.figure = n;
    }

    //对图表数据进行初始化，最多只显示6种种类，多于时，显示最高的六种种类，剩余的都合并成其他类型
    HchartInt(struct) {
        let data = [];
        let color = struct.structType == 4 ? ['#CCCCCC', '#18A0E5', '#FFC000'] : ['#18A0E5', '#AD5EDB', '#32B16C', '#1764C1', '#F05C5C', '#FFC000', '#CCCCCC'];
        let value:number = 0;
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
        return data;
    }


    //结构图表，总消费结构、上次购买结构、购买频次
    StructHchart(struct) {
        let data = this.HchartInt(struct);
        let opts:any = {
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
    }


    //初始化会员画像数据，没有数据则显示“--”
    portraitData = {
        likeBrandName: '--',//会员喜欢的品牌
        likeClassName: '--',//会员喜欢的分类
        totalPurchaseAmount: '--',//总消费金额
        totalPurchaseTimes: '--',//总购买次数
        PCT: '--',                //客单价
        lastPurchaseDate: '--',  //最近消费时间
        notConsumeDays: '--',    //距上次消费天数
        lastConsumeAmount: '--', //最近消费金额
        lastConsumeQty: '--', //最近购买商品件数
        checkInDate: '--',      //登记时间
        checkInStore: '--',    //登记门店
        checkInOperator: '--',  //登记人员
        lastBuyStoreName: '--',    //最后购买门店名称
        lastMonthBuyTimes: '--',  //本月购买次数
        score: '--'            //积分分数
    };


    //会员画像--获取数据，数据初始化
    portraitInt() {
        this.customerService.getCustomerPortrait(this.customer.customerId).then((result)=> {
            if (result.isSucceed) {
                //console.log(result.data);
                if(result.data) {
                    this.portraitData = result.data;
                }
            }
            else {
                let error={
                    function:'portraitInt',
                    userName:AppConfig.userName,
                    logLevel:8,
                    code:result.code,
                    message:result.msg,
                    module:'TrackingModule',
                    source:'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
            //获取消费记录
            this.getConsumeOrder();
        },err=>{
            let error={
                function:'portraitInt',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err.toString(),
                module:'TrackingModule',
                source:'customer-details.ts'
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
        this.customerService.getConsumeOrder(param).then((result)=> {
            if (result.isSucceed) {
                console.log(result.data);
                if (!result.data) result.data = null;
                if (result.data == null || result.data.length <= 0) {
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
                let error={
                    function:'getConsumeOrder',
                    userName:AppConfig.userName,
                    logLevel:8,
                    code:result.code,
                    message:result.msg,
                    module:'TrackingModule',
                    source:'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
            if(param.pageIndex==1) {
                this.getConsumeStructure(4);
                this.getTrackLog();
            }
        },err=>{
            let error={
                function:'getConsumeOrder',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err.toString(),
                module:'TrackingModule',
                source:'customer-details.ts'
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
    LogSelect:number = 1;

    logSelect(name) {
        if(name==2 && this.operateLog.pageIndex==1) {
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
            searchName:'',
            trackResult: 0,
            pageSize: this.trackLog.pageSize,
            pageIndex: this.trackLog.pageIndex++
        };
        //console.log(param);
        //alert(param.pageIndex);
        this.customerService.getTrackLog(param).then((result)=> {
            if (result.isSucceed) {
                console.log(result.data);
                if (!result.data) result.data = null;
                if (result.data == null || result.data.length <= 0) {
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
                    this.trackLog.logs.push(result.data[i]);
                }
            }
            else {
                let error={
                    function:'getTrackLog',
                    userName:AppConfig.userName,
                    logLevel:8,
                    code:result.code,
                    message:result.msg,
                    module:'TrackingModule',
                    source:'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
        },err=>{
            let error={
                function:'getTrackLog',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err.toString(),
                module:'TrackingModule',
                source:'customer-details.ts'
            };
            this.customerService.writeError(error);
        });

    }

    //购买详情
    toggleDetail(log) {
        console.log(log);
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
        console.log('getOperateLog',param);
        this.customerService.getOperateLog(param).then((result)=> {
            if (result.isSucceed) {
                console.log(result.data);
                if (!result.data) result.data = null;
                if (result.data == null || result.data.length <= 0) {
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
                let error={
                    function:'getOperateLog',
                    userName:AppConfig.userName,
                    logLevel:8,
                    code:result.code,
                    message:result.msg,
                    module:'TrackingModule',
                    source:'customer-details.ts'
                };
                this.customerService.writeError(error);
            }
        },err=>{
            let error={
                function:'getOperateLog',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err.toString(),
                module:'TrackingModule',
                source:'customer-details.ts'
            };
            this.customerService.writeError(error);
        });

    }

    goBack() {
        this.navCtrl.pop();
    }


}
