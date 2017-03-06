import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Events } from 'ionic-angular';
import {InterfaceLists}  from '../../../providers/interface_list';
import {PopSer}     from '../../../providers/pop-ser';
import {AppConfig} from "../../../app/app.config";
import {LoginComponent}     from '../../LoginModule/login/login';

import { DatePicker } from 'ionic-native';
@Component({
    selector: 'page-tracking-log',
    templateUrl: 'tracking-log.html',
})
export class TrackingLogComponent {
    select:boolean = false;//筛选开关
    logList:any = [];    //日志列表
    logTotal:number = 0;    //日志总数
    logTotal_show:boolean = false;//日志总数浮窗是否显示
    has_more:boolean=true;  //是否还有更多日志
    //查询条件
    customerName:string='';//会员姓名
    pageSize:number = 10;//每页10个
    pageIndex:number = 1;//默认第一页
    trackResult:string = '0';//跟踪结果查询条件  支持：逗号分隔多状态 2,3,4
    last_trackResult:string=''; //上一次的查询条件  (用于对比查询条件是否变化)

    //语音
    // porocessWidth=document.getElementById("audio_process");//获取进度条节点
    porocessWidth:any="";//获取进度条节点
    // porocessWidth:any="0%";//获取进度条节点
    // porocessWidth.style.width= "0%";
    interval=setInterval(function(){},1000);//循环器
    //语音播放框
    show_audio:any = {
        is_show: false,	//弹窗的显示
        all_time_length: 0,	//总时长
        played_time: 0,		//已经播放的时长
        src: '',//现在播放的音频的src
        logId: '',//现在播放的音频的id
        audiPlayIcon: 'img/grey_play.png',//图标
        currObject: null    //上一个音频对象
    };

    constructor(public navCtrl:NavController,public interface_lists:InterfaceLists, private popser:PopSer,public events: Events) {

    }

    ionViewDidLoad() {
        this.porocessWidth=document.getElementById("audio_process");//获取进度条节点
        this.porocessWidth.style.width= "0%";

        //this.process.width=this.porocessWidth.style.width;
        this.getData();
        // this.showTotal();

    }

    //获取日志总数目
    showTotal() {
        this.logTotal_show = true;
        setTimeout(()=>this.logTotal_show = false, 5000);
    }

    //获取数据
    getData() {
        // data:{orgId:28,customerId:3,trackResult:'2,3,4',pageIndex:1,pageSize:10}
        this.interface_lists.tracklogs({orgId:AppConfig.getUserInfo().orgId,employeeId:AppConfig.getUserInfo().userId,searchName:this.customerName,trackResult:this.trackResult,pageIndex:this.pageIndex,pageSize:this.pageSize}).then((returnData)=>{
            this.last_trackResult=this.trackResult;
            if (returnData.isSucceed && returnData.data) {
                this.logTotal =returnData.total; //记录总数
                this.logList =this.logList.concat(this.initData(returnData.data));
                if(this.trackResult!=this.last_trackResult){
                    this.showTotal();
                }
                if(returnData.data.length < this.pageSize){
                    this.has_more=false;
                }
                
            }else {
                this.has_more=false; //关闭加载更多动画
                //switch (returnData.code) {
                //    case 400:
                //        this.popser.alert('请求不合法（请求安全校验没有通过）');
                //        break;
                //    case 401:
                //        this.popser.alert('请求要求身份验证（TOKEN无效）');
                //        this.navCtrl.push(LoginComponent);
                //        break;
                //    case 405:
                //        this.popser.alert('请求被拒绝');
                //        break;
                //    case 500:
                //        this.popser.alert('系统内部异常');
                //        break;
                //    default:
                //        this.popser.alert('数据获取失败，请重试');
                //        break;
                //}
            }
            this.events.publish('getLogsOk');
        },()=>{
            this.has_more=false; //关闭加载更多动画
            this.popser.alert('服务器连接失败,请稍后再试');
            this.events.publish('getLogsOk');
        });
        
        /*模拟*/
        let res = this.falsedata();//模拟数据
        if (res.IsSucceed) {
            let data = res.data;  //接收返回的数据
            this.logList=this.logList.concat(this.initData(data));
            console.log(this.logList);
        }
    }

    //格式化数据
    initData(data) {
        // let newLogList = [];
        for (let log in data) {
            data[log].showDetail = false;     //购买详情是否显示
            data[log].audio_is_play = false;  //音频在播放
        }
        return data;
    }

    //刷新    (清空列表，页码变1，查询条件不变)
    doRefresh(refresher) {
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            this.last_trackResult=''; //上一次的查询条件  (用于对比查询条件是否变化)
            this.logList = [];    //日志列表
            this.pageIndex = 1;//默认第一页
            this.getData();

            this.events.subscribe('getLogsOk', () => {
                console.log('Async operation has ended');
                refresher.complete();
            });


        }, 2000);
    }

    //加载更多  (页码加1，查询条件不变)
    doInfinite(infiniteScroll) {
        console.log('Begin async operation');

        setTimeout(() => {
            this.pageIndex += 1;
            this.getData();

            this.events.subscribe('getLogsOk', () => {
                console.log('Async operation has ended');
                infiniteScroll.complete();
            });

        }, 500);
    }

    //打开关闭筛选   (关闭时：筛选条件回归上次筛选条件)
    setFilter() {
        this.select = !this.select;
        if(!this.select){
            this.trackResult = this.last_trackResult;
        }
    }

    //筛选选择
    set_trackResult(n) {
        this.trackResult = n;
        console.log(this.trackResult);
    }

    //购买详情
    toggleDetail(log) {
        log.showDetail = !log.showDetail;
        console.log(log);
    }

    //清空筛选  (筛选条件回归上次筛选条件)
    del_selected() {
        this.trackResult = this.last_trackResult;
        this.select = false;
    }

    //确定筛选  （清空列表，页码变1，查询条件变化）
    do_selected() {
        this.select = false;
        console.log(this.trackResult);
        this.getData();
    }

    onCancel(e) {
        console.log('清空名称');
    }

    //搜索
    goSearch(e) {
        console.log(this.customerName);
        if (e.keyCode == 13) {
            alert('search');
            this.logList = [];    //日志列表
            this.pageIndex = 1;//默认第一页
            this.getData();
        }
    }

    //语音播放入口1
    audioplay1(log) {
        this.show_audio.is_show = true;
        if (log.logId != this.show_audio.logId) {//换了一段新的音频
            this.porocessWidth.style.width= "0%";
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
        let audio:any = window.document.getElementById("audio");//获取音频节点
        setTimeout(()=> {
            // this.show_audio.all_time_length = audio.duration;
            if (audio.paused) {
                audio.play();
                this.show_audio.audiPlayIcon = 'img/yellow_play.png';
                this.show_audio.currObject.audio_is_play = true;
                this.interval=setInterval(()=>{
                    this.show_audio.played_time=audio.currentTime;
                    this.porocessWidth.style.width=Math.round(audio.currentTime)/Math.round(audio.duration)*100 +'%';
                    // this.porocessWidth=Math.round(audio.currentTime)/Math.round(audio.duration)*100 +'%';
                    // console.log('aaa');
                    if(audio.ended){
                        this.show_audio.audiPlayIcon='img/grey_play.png';
                        this.show_audio.currObject.audio_is_play=false;
                        window.clearInterval(this.interval);
                    }
                },1000);
            } else {
                window.clearInterval(this.interval);
                this.show_audio.audiPlayIcon = 'img/grey_play.png';
                this.show_audio.currObject.audio_is_play = false;
                audio.pause();
            }
        }, )
    }

    //关闭语音播放框
    audio_close() {
        window.clearInterval(this.interval);
        this.show_audio.currObject.audio_is_play = false;
        this.show_audio= {
            is_show: false,	//弹窗的显示
            all_time_length: 0,	//总时长
            played_time: 0,		//已经播放的时长
            src: '',//现在播放的音频的src
            logId: '',//现在播放的音频的id
            audiPlayIcon: 'img/grey_play.png',//图标
            currObject: null    //上一个音频对象
        }
    }

    Test($event){
        console.log('drag');
    }
    //拖动音频
    tapEvent($event){
        event.preventDefault();
        let ox = $event.target.offsetParent.offsetLeft;//按钮距离音频条的距离
        let	dx = $event.deltaX;//手势拖动的距离

        //console.log(ox , dx , $event.distance);
        //console.log($event);
        let width:any=0;//播音条的长度
        if(this.porocessWidth.style.width===0){
            width = $event.distance;
            console.log(1);
        }
        else{
            if(ox===0){
                let px = $event.target.firstElementChild.offsetLeft;
                if((px+dx)>0){
                    width = Math.abs(px+dx)+30;
                    console.log(width);
                    console.log(2);
                }
            }
            else{
                //width = Math.abs(ox+dx);
                if((ox+dx)>0){
                    width = Math.abs(ox+dx)+30;
                    console.log(3);
                }
            }

        }

        let audio:any = window.document.getElementById("audio");//获取音频节点
        let slideP= width /this.process.width;
        let slideTime= audio.duration * slideP;
        if('fastSeek' in audio){
            audio.fastSeek(slideTime);//改变audio.currentTime的值

        }
        else{
            audio.currentTime= slideTime;

        }
        this.show_audio.played_time=audio.currentTime;
        this.porocessWidth.style.width= width+'px';//播音条的拖动
    }

    process={
        width:0,//进度条的宽度
        borderDistance:0,//进度条距离屏幕最左的距离
        ClickPosition:0,//获取点击的x轴坐标，这个X轴是相对于这个屏幕的
        processClick:function(evt){//获取点击事件得坐标
            evt=evt||window.event;
            var x=0;
            //如果事件对象有pageX属性,对应firefox,opera,chrome,safari浏览器
            if(evt.pageX){
                x=evt.pageX;
            }
            //如果对象有clientX属性,对应IE浏览器
            else if(evt.clientX){
                var offsetX=0;
                //IE6及其以上版本
                if(document.documentElement.scrollLeft){
                    offsetX=document.documentElement.scrollLeft;
                }
                //IE较旧的版本
                else if(document.body){
                    offsetX=document.body.scrollLeft;
                }
                x=evt.clientX+offsetX;
            }
            //console.log(evt);
            //console.log(x);
            return x;
        }
    };


    itemTapped(event) {
        event.preventDefault();
        let audio:any = window.document.getElementById("audio");//获取音频节点
        //audio.oncanplay = function() {
            this.process.width=document.getElementsByClassName("audio_process_panel")[0].clientWidth;//进度条父级的宽度
            this.process.borderDistance=(document.body.clientWidth - this.process.width)/2;//进度条距离屏幕最左的距离
            this.process.ClickPosition = this.process.processClick(event);//获取点击的x轴坐标，这个X轴是相对于这个屏幕的
            var scrollPosition= this.process.ClickPosition - this.process.borderDistance;//滚动距离等于获取到的x轴距离减去进度条距离屏幕最左距离
            var percent= scrollPosition/this.process.width;
            this.porocessWidth.style.width =percent  *100  +'%';//滚动条的滚动比例
            var playTime=audio.duration * percent;
            audio.currentTime=playTime;
            //return playTime;
            //console.log(audio.currentTime);
            console.log(playTime);
        //};
        console.log('click');
        this.show_audio.played_time=audio.currentTime;
    }








    //模拟数据
    falsedata() {
        let returnData = {
            code: 0,
            msg: '执行成功',
            IsSucceed: true,
            data: [{
                logId: 1,
                userId: 1,
                employeeName: '',       //导购名称
                customerId: 120155,     //导购id
                customerName: '孙逊1',   //会员名称
                remark: '',             //备注
                trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
                trackDetail:{
                    content:'',
                    contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
                    voiceRecordSize: 70,    //录音时长
                    voiceRecordUrl: 'http://www.w3school.com.cn/i/song.mp3',   //录音文件地址
                    trackDate: '2016-10-15',
                    notContactReason:1, //无联系上原因
                    nextAction:1, //下次跟踪的动作  1：系统设置任务  2：手动指定任务  3：不再进行跟踪
                    nextTrackDate:'2016-10-15',//下一次跟踪任务时间
                },
                version: 0x104552152,    //客户端版本号
                orders:[{
                    consumeDate: '2016-10-12 12:25:21',
                    saleAmount: 226.00,
                    orderNo: '12020813218631482',
                    goods: [{
                        goodsNo: 'IN00031',
                        goodsName: '雅培亲体金装喜康力3段 900g',
                        quantity: 1,
                        saleAmount: 158.00
                    }, {
                        goodsNo: 'IN01021',
                        goodsName: '婴姿坊婴童专用洗衣皂',
                        quantity: 5,
                        saleAmount: 25.5
                    }, {
                        goodsNo: 'IN03181',
                        goodsName: '仿藤椅（子）',
                        quantity: 1,
                        saleAmount: 21.00
                    }, {
                        goodsNo: 'IN02879',
                        goodsName: '伊威草莓味磨牙棒',
                        quantity: 1,
                        saleAmount: 21.50
                    }]
                }],
            },{
                logId: 2,
                userId: 1,
                employeeName: '',       //导购名称
                customerId: 120155,     //导购id
                customerName: '孙逊2',   //会员名称
                remark: '',             //备注
                trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
                trackDetail:{
                    content:'',
                    contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
                    voiceRecordSize: 70,    //录音时长
                    voiceRecordUrl: 'http://www.w3school.com.cn/i/song.mp3',   //录音文件地址
                    trackDate: '2016-10-15',
                    notContactReason:1, //无联系上原因
                    nextAction:1, //下次跟踪的动作  1：系统设置任务  2：手动指定任务  3：不再进行跟踪
                    nextTrackDate:'2016-10-15',//下一次跟踪任务时间
                },
                version: 0x104552152,    //客户端版本号
                orders:[{
                    consumeDate: '2016-10-12 12:25:21',
                    saleAmount: 226.00,
                    orderNo: '12020813218631482',
                    goods: [{
                        goodsNo: 'IN00031',
                        goodsName: '雅培亲体金装喜康力3段 900g',
                        quantity: 1,
                        saleAmount: 158.00
                    }, {
                        goodsNo: 'IN01021',
                        goodsName: '婴姿坊婴童专用洗衣皂',
                        quantity: 5,
                        saleAmount: 25.5
                    }, {
                        goodsNo: 'IN03181',
                        goodsName: '仿藤椅（子）',
                        quantity: 1,
                        saleAmount: 21.00
                    }, {
                        goodsNo: 'IN02879',
                        goodsName: '伊威草莓味磨牙棒',
                        quantity: 1,
                        saleAmount: 21.50
                    }]
                }],
            },{
                logId: 3,
                userId: 1,
                employeeName: '',       //导购名称
                customerId: 120155,     //导购id
                customerName: '孙逊3',   //会员名称
                remark: '',             //备注
                trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
                trackDetail:{
                    content:'',
                    contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
                    voiceRecordSize: 70,    //录音时长
                    voiceRecordUrl: 'http://www.w3school.com.cn/i/song.mp3',   //录音文件地址
                    trackDate: '2016-10-15',
                    notContactReason:1, //无联系上原因
                    nextAction:1, //下次跟踪的动作  1：系统设置任务  2：手动指定任务  3：不再进行跟踪
                    nextTrackDate:'2016-10-15',//下一次跟踪任务时间
                },
                version: 0x104552152,    //客户端版本号
                orders:[{
                    consumeDate: '2016-10-12 12:25:21',
                    saleAmount: 226.00,
                    orderNo: '12020813218631482',
                    goods: [{
                        goodsNo: 'IN00031',
                        goodsName: '雅培亲体金装喜康力3段 900g',
                        quantity: 1,
                        saleAmount: 158.00
                    }, {
                        goodsNo: 'IN01021',
                        goodsName: '婴姿坊婴童专用洗衣皂',
                        quantity: 5,
                        saleAmount: 25.5
                    }, {
                        goodsNo: 'IN03181',
                        goodsName: '仿藤椅（子）',
                        quantity: 1,
                        saleAmount: 21.00
                    }, {
                        goodsNo: 'IN02879',
                        goodsName: '伊威草莓味磨牙棒',
                        quantity: 1,
                        saleAmount: 21.50
                    }]
                }],
            },{
                logId: 4,
                userId: 1,
                employeeName: '',       //导购名称
                customerId: 120155,     //导购id
                customerName: '孙逊4',   //会员名称
                remark: '',             //备注
                trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
                trackDetail:{
                    content:'',
                    contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
                    voiceRecordSize: 70,    //录音时长
                    voiceRecordUrl: 'http://www.w3school.com.cn/i/song.mp3',   //录音文件地址
                    trackDate: '2016-10-15',
                    notContactReason:1, //无联系上原因
                    nextAction:1, //下次跟踪的动作  1：系统设置任务  2：手动指定任务  3：不再进行跟踪
                    nextTrackDate:'2016-10-15',//下一次跟踪任务时间
                },
                version: 0x104552152,    //客户端版本号
                orders:[{
                    consumeDate: '2016-10-12 12:25:21',
                    saleAmount: 226.00,
                    orderNo: '12020813218631482',
                    goods: [{
                        goodsNo: 'IN00031',
                        goodsName: '雅培亲体金装喜康力3段 900g',
                        quantity: 1,
                        saleAmount: 158.00
                    }, {
                        goodsNo: 'IN01021',
                        goodsName: '婴姿坊婴童专用洗衣皂',
                        quantity: 5,
                        saleAmount: 25.5
                    }, {
                        goodsNo: 'IN03181',
                        goodsName: '仿藤椅（子）',
                        quantity: 1,
                        saleAmount: 21.00
                    }, {
                        goodsNo: 'IN02879',
                        goodsName: '伊威草莓味磨牙棒',
                        quantity: 1,
                        saleAmount: 21.50
                    }]
                }],
            },{
                logId: 5,
                userId: 1,
                employeeName: '',       //导购名称
                customerId: 120155,     //导购id
                customerName: '孙逊5',   //会员名称
                remark: '',             //备注
                trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
                trackDetail:{
                    content:'',
                    contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
                    voiceRecordSize: 70,    //录音时长
                    voiceRecordUrl: 'http://www.w3school.com.cn/i/song.mp3',   //录音文件地址
                    trackDate: '2016-10-15',
                    notContactReason:1, //无联系上原因
                    nextAction:1, //下次跟踪的动作  1：系统设置任务  2：手动指定任务  3：不再进行跟踪
                    nextTrackDate:'2016-10-15',//下一次跟踪任务时间
                },
                version: 0x104552152,    //客户端版本号
                orders:[{
                    consumeDate: '2016-10-12 12:25:21',
                    saleAmount: 226.00,
                    orderNo: '12020813218631482',
                    goods: [{
                        goodsNo: 'IN00031',
                        goodsName: '雅培亲体金装喜康力3段 900g',
                        quantity: 1,
                        saleAmount: 158.00
                    }, {
                        goodsNo: 'IN01021',
                        goodsName: '婴姿坊婴童专用洗衣皂',
                        quantity: 5,
                        saleAmount: 25.5
                    }, {
                        goodsNo: 'IN03181',
                        goodsName: '仿藤椅（子）',
                        quantity: 1,
                        saleAmount: 21.00
                    }, {
                        goodsNo: 'IN02879',
                        goodsName: '伊威草莓味磨牙棒',
                        quantity: 1,
                        saleAmount: 21.50
                    }]
                }],
            },{
                logId: 6,
                userId: 1,
                employeeName: '',       //导购名称
                customerId: 120155,     //导购id
                customerName: '孙逊6',   //会员名称
                remark: '',             //备注
                trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
                trackDetail:{
                    content:'',
                    contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
                    voiceRecordSize: 70,    //录音时长
                    voiceRecordUrl: 'http://www.w3school.com.cn/i/song.mp3',   //录音文件地址
                    trackDate: '2016-10-15',
                    notContactReason:1, //无联系上原因
                    nextAction:1, //下次跟踪的动作  1：系统设置任务  2：手动指定任务  3：不再进行跟踪
                    nextTrackDate:'2016-10-15',//下一次跟踪任务时间
                },
                version: 0x104552152,    //客户端版本号
                orders:[{
                    consumeDate: '2016-10-12 12:25:21',
                    saleAmount: 226.00,
                    orderNo: '12020813218631482',
                    goods: [{
                        goodsNo: 'IN00031',
                        goodsName: '雅培亲体金装喜康力3段 900g',
                        quantity: 1,
                        saleAmount: 158.00
                    }, {
                        goodsNo: 'IN01021',
                        goodsName: '婴姿坊婴童专用洗衣皂',
                        quantity: 5,
                        saleAmount: 25.5
                    }, {
                        goodsNo: 'IN03181',
                        goodsName: '仿藤椅（子）',
                        quantity: 1,
                        saleAmount: 21.00
                    }, {
                        goodsNo: 'IN02879',
                        goodsName: '伊威草莓味磨牙棒',
                        quantity: 1,
                        saleAmount: 21.50
                    }]
                }],
            },{
                logId: 7,
                userId: 1,
                employeeName: '',       //导购名称
                customerId: 120155,     //导购id
                customerName: '孙逊7',   //会员名称
                remark: '',             //备注
                trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
                trackDetail:{
                    content:'',
                    contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
                    voiceRecordSize: 70,    //录音时长
                    voiceRecordUrl: 'http://www.w3school.com.cn/i/song.mp3',   //录音文件地址
                    trackDate: '2016-10-15',
                    notContactReason:1, //无联系上原因
                    nextAction:1, //下次跟踪的动作  1：系统设置任务  2：手动指定任务  3：不再进行跟踪
                    nextTrackDate:'2016-10-15',//下一次跟踪任务时间
                },
                version: 0x104552152,    //客户端版本号
                orders:[{
                    consumeDate: '2016-10-12 12:25:21',
                    saleAmount: 226.00,
                    orderNo: '12020813218631482',
                    goods: [{
                        goodsNo: 'IN00031',
                        goodsName: '雅培亲体金装喜康力3段 900g',
                        quantity: 1,
                        saleAmount: 158.00
                    }, {
                        goodsNo: 'IN01021',
                        goodsName: '婴姿坊婴童专用洗衣皂',
                        quantity: 5,
                        saleAmount: 25.5
                    }, {
                        goodsNo: 'IN03181',
                        goodsName: '仿藤椅（子）',
                        quantity: 1,
                        saleAmount: 21.00
                    }, {
                        goodsNo: 'IN02879',
                        goodsName: '伊威草莓味磨牙棒',
                        quantity: 1,
                        saleAmount: 21.50
                    }]
                }],
            },]}
        
        return returnData;
    }




}
