import { Injectable } from '@angular/core';

import { HttpSer } from '../../providers/http-ser';
import {TrackLog} from './track-log.model';

export const LOGS=[{
    logId: 1,
    userId: 1,
    employeeName: '',       //导购名称
    customerId: 120155,     //导购id
    customerName: '孙逊1',   //会员名称
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-10-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
    version: 0x104552152    //客户端版本号
}, {
    logId: 2,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '孙逊2',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-1-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 3,
    orders: [{
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
        },{
            goodsNo: 'IN03181',
            goodsName: '仿藤椅（子）',
            quantity: 1,
            saleAmount: 21.00
        },{
            goodsNo: 'IN02879',
            goodsName: '伊威草莓味磨牙棒',
            quantity: 1,
            saleAmount: 21.50
        }]
    }],
    version: 0x104552152
}, {
    logId: 3,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '孙逊3',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-3-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 1,
    version: 0x104552152
}, {
    logId: 4,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-10-9',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 2,
    version: 0x104552152
}, {
    logId: 5,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-10-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 2,
    version: 0x104552152
}, {
    logId: 1,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-10-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 2,
    version: 0x104552152
}, {
    logId: 1,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-10-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 2,
    version: 0x104552152
}, {
    logId: 1,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-10-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 2,
    version: 0x104552152
}, {
    logId: 1,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-10-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 2,
    version: 0x104552152
}, {
    logId: 1,
    userId: 1,
    employeeName: '',
    customerId: 120155,
    customerName: '',
    trackDetails:{
        content:'有买奶粉跟尿裤这个宝宝奶量挺大的，现在吃美赞有点可惜，奶粉才买没吃完',
        contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
        voiceRecordSize: 10,    //录音时长
        voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
        trackDate: '2016-10-15',
        notContactReason:2,
        nextAction:1,
        nextTrackDate:''
    },
    trackResult: 2,
    version: 0x104552152
}];

@Injectable()
export class TrackLogService {
    constructor(private httpser: HttpSer) {
    }

    getTrackLogs(param:any): any {
        //todo通过服务端请求数据
        let result:any;
        let url:string='/crm/customer/tracklogs';
        //this.httpser.post(url, param).then(result => result = result);
        result={
            data:LOGS,
            total:LOGS.length
        }
        return result;
    }
}