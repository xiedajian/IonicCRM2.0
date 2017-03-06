import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';

//import { HttpSer } from '../../providers/http-ser';
import {Customer} from './customer.model';
import {CustomerLevel,TrackDateCalcType,CustomerStatus,TrackResult} from './enum';
import {CRMService} from './crm.service';
import {AppConfig} from'../../app/app.config';


export const CUSTOMERS:Customer[]=[
    {
        customerId:1,
        customerName:'张三',
        isNew:false,
        isNewAssign:false,
        contactMobile:'15059100003',
        customerLevel:CustomerLevel.Important,
        lastTrackDate:'2016-12-15',
        nextTrackDate:'2017-2-10',
        trackDateCalcType:TrackDateCalcType.System,
        status:CustomerStatus.Track,
        trackResult:TrackResult.Assess,
        lastTrackLog:'家里还有5罐奶粉，夏天纸尿裤用少了',
        evaluateStatus:false
    },
    {
        customerId:2,
        customerName:'李四',
        isNew:true,
        isNewAssign:true,
        contactMobile:'',
        customerLevel:CustomerLevel.Core,
        lastTrackDate:'2016-12-16',
        nextTrackDate:'2016-12-18',
        trackDateCalcType:TrackDateCalcType.Manual,
        status:CustomerStatus.UnTrack,
        trackResult:TrackResult.Purchase,
        lastTrackLog:'',
        evaluateStatus:true
    },
    {
        customerId:3,
        customerName:'王五',
        isNew:true,
        isNewAssign:true,
        contactMobile:'',
        customerLevel:CustomerLevel.Silent,
        lastTrackDate:'2016-10-16',
        nextTrackDate:'2017-2-20',
        trackDateCalcType:TrackDateCalcType.System,
        status:CustomerStatus.Track,
        trackResult:TrackResult.Purchase,
        lastTrackLog:'王五',
        evaluateStatus:true
    },
    {
        customerId:4,
        customerName:'赵六',
        isNew:true,
        isNewAssign:false,
        contactMobile:'15059100006',
        customerLevel:CustomerLevel.Important,
        lastTrackDate:'2016-12-15',
        nextTrackDate:'2016-12-26',
        trackDateCalcType:TrackDateCalcType.System,
        status:CustomerStatus.Track,
        trackResult:TrackResult.Assess,
        lastTrackLog:'家里还有5罐奶粉，夏天纸尿裤用少了,夏天纸尿裤用少了,夏天纸尿裤用少了,夏天纸尿裤用少了',
        evaluateStatus:true
    },
    {
        customerId:5,
        customerName:'钱七',
        isNew:false,
        isNewAssign:false,
        contactMobile:'15059100007',
        customerLevel:CustomerLevel.Invalid,
        lastTrackDate:'2016-12-15',
        nextTrackDate:'2016-12-30',
        trackDateCalcType:TrackDateCalcType.System,
        status:CustomerStatus.Track,
        trackResult:TrackResult.Assess,
        lastTrackLog:'家里还有5罐奶粉，夏天纸尿裤用少了',
        evaluateStatus:false
    },
    {
        customerId:1,
        customerName:'张八',
        isNew:false,
        isNewAssign:false,
        contactMobile:'15059100003',
        customerLevel:CustomerLevel.Important,
        lastTrackDate:'2016-12-15',
        nextTrackDate:'2016-9-21',
        trackDateCalcType:TrackDateCalcType.System,
        status:CustomerStatus.Track,
        trackResult:TrackResult.Assess,
        lastTrackLog:'家里还有5罐奶粉，夏天纸尿裤用少了',
        evaluateStatus:false
    },
    {
        customerId:2,
        customerName:'李九',
        isNew:true,
        isNewAssign:true,
        contactMobile:'',
        customerLevel:CustomerLevel.Core,
        lastTrackDate:'2016-12-16',
        nextTrackDate:'2016-12-18',
        trackDateCalcType:TrackDateCalcType.Manual,
        status:CustomerStatus.UnTrack,
        trackResult:TrackResult.Purchase,
        lastTrackLog:'',
        evaluateStatus:true
    },
    {
        customerId:3,
        customerName:'王十',
        isNew:true,
        isNewAssign:true,
        contactMobile:'',
        customerLevel:CustomerLevel.Silent,
        lastTrackDate:'2016-10-16',
        nextTrackDate:'2016-10-18',
        trackDateCalcType:TrackDateCalcType.System,
        status:CustomerStatus.Track,
        trackResult:TrackResult.Purchase,
        lastTrackLog:'王十一',
        evaluateStatus:true
    },
    {
        customerId:4,
        customerName:'赵十二',
        isNew:true,
        isNewAssign:false,
        contactMobile:'15059100006',
        customerLevel:CustomerLevel.Important,
        lastTrackDate:'2016-12-15',
        nextTrackDate:'2016-12-26',
        trackDateCalcType:TrackDateCalcType.System,
        status:CustomerStatus.Track,
        trackResult:TrackResult.Assess,
        lastTrackLog:'家里还有5罐奶粉，夏天纸尿裤用少了,夏天纸尿裤用少了,夏天纸尿裤用少了,夏天纸尿裤用少了',
        evaluateStatus:true
    },
    {
        customerId:5,
        customerName:'钱十三',
        isNew:false,
        isNewAssign:false,
        contactMobile:'15059100007',
        customerLevel:CustomerLevel.Invalid,
        lastTrackDate:'2016-12-15',
        nextTrackDate:'2016-12-30',
        trackDateCalcType:TrackDateCalcType.System,
        status:CustomerStatus.Track,
        trackResult:TrackResult.Assess,
        lastTrackLog:'家里还有5罐奶粉，夏天纸尿裤用少了',
        evaluateStatus:false
    }
];
export const CUSTOMER:Customer={
    customerId:4,
    customerName:'赵六',
    isNew:true,
    isNewAssign:false,
    contactMobile:'15059100006',
    customerLevel:CustomerLevel.Important,
    lastTrackDate:'2016-12-15',
    nextTrackDate:'2016-12-26',
    trackDateCalcType:TrackDateCalcType.System,
    status:CustomerStatus.Track,
    trackResult:TrackResult.Assess,
    lastTrackLog:'家里还有5罐奶粉，夏天纸尿裤用少了,夏天纸尿裤用少了,夏天纸尿裤用少了,夏天纸尿裤用少了',
    evaluateStatus:true
};
const PORTRAITDATA= {
    likeBrandName: '爱他美',//会员喜欢的品牌
    likeClassName: '--',//会员喜欢的分类
    totalPurchaseAmount: 21563.23,//总消费金额
    totalPurchaseTimes: 59,//总购买次数
    PCT: 365.48,                //客单价
    lastPurchaseDate: "2016-12-10",  //最近消费时间
    notConsumeDays: 5,    //距上次消费天数
    lastConsumeAmount: 5146.21, //最近消费金额
    lastConsumeQty: 17, //最近购买商品件数
    checkInDate: '--',      //登记时间
    checkInStore: '--',    //登记门店
    checkInOperator: '--',  //登记人员
    lastBuyStoreName: '--',    //最后购买门店名称
    lastMonthBuyTimes: '--',  //本月购买次数
    score: '--'            //积分分数
};
const CONSUMESTRUCTURE={
    isSucceed: true,
    code:200,
    data: {
        overallStruct: [{
            classNo: "10002",
            className: "奶粉",
            totalAmount: 3326.20
        }, {
            classNo: "10003",
            className: "尿布",
            totalAmount: 626.20
        }, {
            classNo: "10003",
            className: "花王纸尿布",
            totalAmount: 136.20
        }, {
            classNo: "10003",
            className: "服饰",
            totalAmount: 526.20
        }, {
            classNo: "10003",
            className: "玩具",
            totalAmount: 226.20
        }, {
            classNo: "10003",
            className: "帮宝适纸尿裤",
            totalAmount: 826.20
        }, {
            classNo: "10001",
            className: "洗具",
            totalAmount: 526.20
        }],
        lastStruct: [{
            classNo: "10003",
            className: "尿布",
            totalAmount: 626.20
        }, {
            classNo: "10001",
            className: "洗具",
            totalAmount: 526.20
        }],
        buyFrequency: [{
            month: 201610,
            times: 2
        }, {
            month: 201608,
            times: 3
        }, {
            month: 201607,
            times: 5
        }],
        resultStruct: [{
            code: 3,
            name: "已购买",
            times: 12
        }, {
            code: 4,
            name: "未购买",
            times: 18
        }, {
            code: 2,
            name: "待评估",
            times: 33
        }]
    }
};
const CONSUMEORDER= {
    isSucceed: true,
    code:200,
    data: [{
        consumeDate: "2016-10-12 12:25:21",
        saleAmount: 226.00,
        storeId: "1001",
        storeName: "仓山店",
        orderNo: "12020813218631482",
        goods: [{
            goodsNo: "IN00031",
            goodsName: "雅培亲体金装喜康力3段 900g",
            quantity: 1,
            saleAmount: 158.00
        }, {
            goodsNo: "IN01021",
            goodsName: "婴姿坊婴童专用洗衣皂",
            quantity: 5,
            saleAmount: 25.5
        }, {
            goodsNo: "IN03181",
            goodsName: "仿藤椅（子）",
            quantity: 1,
            saleAmount: 21.00
        }, {
            goodsNo: "IN02879",
            goodsName: "伊威草莓味磨牙棒",
            quantity: 1,
            saleAmount: 21.50
        }]
    }, {
        consumeDate: "2016-10-12 12:25:21",
        saleAmount: 226.00,
        storeId: "1001",
        storeName: "仓山店",
        orderNo: "12020813218631482",
        goods: [{
            goodsNo: "IN00031",
            goodsName: "雅培亲体金装喜康力3段 900g",
            quantity: 1,
            saleAmount: 158.00
        }, {
            goodsNo: "IN01021",
            goodsName: "婴姿坊婴童专用洗衣皂",
            quantity: 5,
            saleAmount: 25.5
        }, {
            goodsNo: "IN03181",
            goodsName: "仿藤椅（子）",
            quantity: 1,
            saleAmount: 21.00
        }, {
            goodsNo: "IN02879",
            goodsName: "伊威草莓味磨牙棒",
            quantity: 1,
            saleAmount: 21.50
        }]
    }]
};
const TRACKLOG= {
    isSucceed: true,
    code:200,
    data: [{
        logId: 1,
        userId: 1,
        employeeName: '吴丽',       //导购名称
        customerId: 120155,     //导购id
        customerName: '孙逊1',   //会员名称
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 2,         //0：none  1：未联系上2：待评估3：产生购买（会有详情）4：未产生购买
        trackDateCalcType: 1,   //跟踪方式  1系统  2人工指定
        remark: '',             //备注
        version: 0x104552152 ,  //客户端版本号
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
        },{
            consumeDate: '2017-10-12 12:25:21',
            saleAmount: 663.00,
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
    }, {
        logId: 2,
        userId: 1,
        employeeName: '刘德华',
        customerId: 120155,
        customerName: '孙逊2',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
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
        trackDateCalcType: 1,
        remark: '吴丽将该会员的下次跟踪时间人工指定到09-28',
        version: 0x104552152
    }, {
        logId: 3,
        userId: 1,
        employeeName: '周迅',
        customerId: 120155,
        customerName: '孙逊3',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 1,
        trackDateCalcType: 1,
        remark: '吴丽将该会员的下次跟踪时间人工指定到09-28',
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
        logId: 4,
        userId: 1,
        employeeName: '田梅',
        customerId: 120155,
        customerName: '',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 2,
        trackDateCalcType: 1,
        remark: '吴丽将该会员的设置为不可跟踪',
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
        logId: 5,
        userId: 1,
        employeeName: '周潇',
        customerId: 120155,
        customerName: '',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 2,
        trackDateCalcType: 1,
        remark: '',
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
        logId: 1,
        userId: 1,
        employeeName: '董洁',
        customerId: 120155,
        customerName: '',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 2,
        trackDateCalcType: 1,
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
        remark: '',
        version: 0x104552152
    }, {
        logId: 1,
        userId: 1,
        employeeName: '',
        customerId: 120155,
        customerName: '',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 2,
        trackDateCalcType: 1,
        remark: '吴丽将该会员的下次跟踪时间人工指定到09-28',
        version: 0x104552152
    }, {
        logId: 1,
        userId: 1,
        employeeName: '',
        customerId: 120155,
        customerName: '',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 2,
        trackDateCalcType: 1,
        remark: '',
        version: 0x104552152
    }, {
        logId: 1,
        userId: 1,
        employeeName: '',
        customerId: 120155,
        customerName: '',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 2,
        trackDateCalcType: 1,
        remark: '',
        version: 0x104552152
    }, {
        logId: 1,
        userId: 1,
        employeeName: '',
        customerId: 120155,
        customerName: '',
        trackDetail:{
            content:'家里还有5罐奶粉，夏天纸尿裤用少了',
            contactType: 1,        //通话方式 1 :普通通话 2 :免费通话3 :上门拜访 4 :QQ 5 :weixin微信 6 :SMS短信 10:其它沟通渠道
            voiceRecordSize: 10,    //录音时长
            voiceRecordUrl: 'mp3/same.mp3',   //录音文件地址
            trackDate: '2016-10-15',
            notContactReason: 1,
            nextAction: 1,
            nextTrackDate: '2016-10-15',
        },
        trackResult: 2,
        trackDateCalcType: 1,
        remark: '',
        version: 0x104552152
    }]
};
const OPERATLOG={
    isSucceed:  true,
    code:200,
    data: [{
        id: 1,
        operateDate: "2016-10-13 15:20:18",
        operateUuid: 0,
        operarteName: "系统管理员",
        remark: "管理员 陈店长 将会员 张三丰 从 刘备 分配给 伍丽负责跟踪"
    },{
        id: 2,
        operateDate: "2016-10-13 15:20:18",
        operateUuid: 2,
        operarteName: "伍丽",
        remark:"执行人员 伍丽 将会员 张三丰 的下次跟踪时间修改为2016年09月28日"
    }]
};

@Injectable()
export class CustomerService {

    constructor(public crmService:CRMService,public storage:Storage) {
        this.orgId = AppConfig.userInfo.orgId;
    }

    //公司组织Id
    orgId:number;
    //今日待跟踪会员
    todayCustomers:Customer[] = [];
    //全部跟踪会员
    allCustomers:Customer[] = [];
    //当前查看的跟踪会员
    customers:Customer[] = [];
    //共搜索到总会员数
    total:number;
    //是否显示结束
    isEnd:boolean;
    //是否加载完成
    isLoad:boolean = false;
    //是否提示搜索结果
    searchTip:boolean = false;
    //最后跟踪日期
    lastTrackDate:string;

    //今日待跟踪，全部跟踪会员过滤条件
    filters:any[]=[{},{}];

    //今日待跟踪，全部跟踪会员过滤条件是否相同
    isSameFilter(filter1,filter2):boolean {
        if (filter1 == null || filter2 == null) {
            return false;
        }
        if (filter1.orderBy !== filter2.orderBy) {
            return false;
        }
        if (filter1.lastBuyed !== filter2.lastBuyed) {
            return false;
        }
        if (filter1.lastContact !== filter2.lastContact) {
            return false;
        }
        if (filter1.trackStatus !== filter2.trackStatus) {
            return false;
        }
        if (filter1.dateCalcType !== filter2.dateCalcType) {
            return false;
        }
        if (filter1.isNew !== filter2.isNew) {
            return false;
        }
        if (filter1.isNewAssign !== filter2.isNewAssign) {
            return false;
        }
        if (filter1.customerLevel !== filter2.customerLevel) {
            return false;
        }
        if (filter1.lastBuyDate !== filter2.lastBuyDate) {
            return false;
        }
        if (filter1.maxPCT !== filter2.maxPCT) {
            return false;
        }
        if (filter1.minPCT !== filter2.minPCT) {
            return false;
        }
        if (filter1.maxBuyCount !== filter2.maxBuyCount) {
            return false;
        }
        if (filter1.minBuyCount !== filter2.minBuyCount) {
            return false;
        }
        if (filter1.classNo !== filter2.classNo) {
            return false;
        }
        if (filter1.brandType !== filter2.brandType) {
            return false;
        }
        if (filter1.brandNo !== filter2.brandNo) {
            return false;
        }
        return true;
    }

    //过滤条件更新
    setFilter(newFilter,oldFilter) {
        newFilter.orderBy = oldFilter.orderBy;
        newFilter.lastBuyed = oldFilter.lastBuyed;
        newFilter.lastContact = oldFilter.lastContact;
        newFilter.trackStatus = oldFilter.trackStatus;
        newFilter.dateCalcType = oldFilter.dateCalcType;
        newFilter.isNew = oldFilter.isNew;
        newFilter.isNewAssign = oldFilter.isNewAssign;
        newFilter.customerLevel = oldFilter.customerLevel;
        newFilter.lastBuyDate = oldFilter.lastBuyDate;
        newFilter.maxPCT = oldFilter.maxPCT;
        newFilter.minPCT = oldFilter.minPCT;
        newFilter.maxBuyCount = oldFilter.maxBuyCount;
        newFilter.minBuyCount = oldFilter.minBuyCount;
        newFilter.classNo = oldFilter.classNo;
        newFilter.brandType = oldFilter.brandType;
        newFilter.brandNo = oldFilter.brandNo;
        newFilter.pageIndex = oldFilter.pageIndex;
        newFilter.top = oldFilter.top;
        newFilter.isEnd = this.isEnd;
        newFilter.total = this.total;
    }

    //模拟数据
    getCustomersByHttpSlow(param:any):Promise<any> {
        return new Promise<any>(resolve=>
            setTimeout(resolve, 1000))
            .then(()=>{
                let result = {
                    isSucceed: true,
                    data: param.dataType == 0 ? CUSTOMERS.slice(0, 5) : CUSTOMERS.slice(0),
                    total: param.dataType == 0 ? 5 : CUSTOMERS.length
                };
                return Promise.resolve(result);
            });
    }

    //获取会员列表
    getCustomers(param:any,event:any) {
        //this.crmService.getCustomers(param).then(result=> {
        this.getCustomersByHttpSlow(param).then(result=> {
            if (result.isSucceed) {
                console.log(param, result);
                if (!result.data) result.data = null;
                if (result.data == null || result.data.length <= 0) {
                    this.isEnd = true;
                }
                else {
                    if (result.data.length < param.pageSize) {
                        this.isEnd = true;
                    }
                    else {
                        this.isEnd = false;
                    }
                }
                if (param.pageIndex == 1) {
                    if (param.dataType == 0) {
                        this.todayCustomers = result.data;
                        this.customers = this.todayCustomers;
                    }
                    else {
                        this.allCustomers = result.data;
                        this.customers = this.allCustomers;
                    }
                    this.total = result.total;
                    this.isLoad = true;
                }
                else {
                    if (result.data && result.data.length > 0) {
                        if (param.dataType == 0) {
                            for (let i = 0; i < result.data.length; i++) {
                                this.todayCustomers.push(result.data[i]);
                            }
                            this.customers = this.todayCustomers;
                        }
                        else {
                            for (let i = 0; i < result.data.length; i++) {
                                this.allCustomers.push(result.data[i]);
                            }
                            this.customers = this.allCustomers;
                        }
                    }
                }
                /*
                 if (param.dataType == 0) {
                 if (param.pageIndex == 1) {
                 if (result.data == null || result.data.length <= 0) {
                 this.isEnd = true;
                 }
                 else {
                 if (result.data.length < param.pageSize) {
                 this.isEnd = true;
                 }
                 else {
                 this.isEnd = false;
                 }
                 }
                 this.todayCustomers = result.data;
                 this.total = result.total;
                 this.isLoad = true;
                 }
                 else {
                 if (result.data == null || result.data.length <= 0) {
                 this.isEnd = true;
                 }
                 else {
                 if (result.data.length < param.pageSize) {
                 this.isEnd = true;
                 }
                 else {
                 this.isEnd = false;
                 }
                 this.todayCustomers = this.todayCustomers.concat(result.data);
                 }
                 }
                 this.customers = this.todayCustomers;
                 }
                 else {
                 if (param.pageIndex == 1) {
                 if (result.data == null || result.data.length <= 0) {
                 this.isEnd = true;
                 }
                 else {
                 if (result.data.length < param.pageSize) {
                 this.isEnd = true;
                 }
                 else {
                 this.isEnd = false;
                 }
                 }
                 this.allCustomers = result.data;
                 this.total = result.total;
                 this.isLoad = true;
                 }
                 else {
                 if (result.data == null || result.data.length <= 0) {
                 this.isEnd = true;
                 }
                 else {
                 if (result.data.length < param.pageSize) {
                 this.isEnd = true;
                 }
                 else {
                 this.isEnd = false;
                 }
                 this.allCustomers = this.allCustomers.concat(result.data);
                 }
                 }
                 this.customers = this.allCustomers;
                 }*/

                if (param.pageIndex == 1) {
                    this.searchTip = true;
                    setTimeout(() => {
                        this.searchTip = false;
                    }, 3000);
                }
                if (event != null) {
                    event.complete();
                }
            }
            else {
                let error={
                    function:'getCustomers',
                    userName:AppConfig.userName,
                    logLevel:8,
                    code:result.code,
                    message:result.msg,
                    module:'SharedModule',
                    source:'customer.service.ts'
                };
                this.writeError(error);
            }
        },
        err=>{
            let error={
                function:'getCustomers',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err.toString(),
                module:'SharedModule',
                source:'customer.service.ts'
            };
            this.writeError(error);
        });
    }



    //模拟数据
    getCustomerByHttpSlow(customerId:number):Promise<any> {
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>{
                let result = {
                    isSucceed: true,
                    data: CUSTOMER
                };
                return Promise.resolve(result);
            });
    }

    //获取指定会员
    getCustomer(customerId:number){
        //return this.crmService.getCustomer(this.orgId,customerId);
        return this.getCustomerByHttpSlow(customerId);
    }

    //删除今日待跟踪列表的会员
    removeCustomerById(customerId:number) {
        for (let i = 0; i < this.todayCustomers.length; i++) {
            if (this.todayCustomers[i].customerId === customerId) {
                this.todayCustomers.splice(i, 1);
                this.total--;
                let now = (new Date()).toLocaleDateString();
                if (this.lastTrackDate !== now) {
                    this.storage.set('lastTrackDate', now).then(()=> {
                        this.lastTrackDate = now;
                    }, (err)=> {
                        let error={
                            function:'removeCustomerById',
                            userName:AppConfig.userName,
                            logLevel:16,
                            code:0,
                            message:err || 'error',
                            module:'SharedModule',
                            source:'customer.service.ts'
                        };
                        this.writeError(error);
                    }).catch((err)=> {
                        let error={
                            function:'removeCustomerById',
                            userName:AppConfig.userName,
                            logLevel:16,
                            code:0,
                            message:err || 'error',
                            module:'SharedModule',
                            source:'customer.service.ts'
                        };
                        this.writeError(error);
                    });
                }
                break;
            }
        }
    }

    //更新全部跟踪会员信息
    updateCustomer(customer:Customer) {
        for (let i = 0; i < this.allCustomers.length; i++) {
            if (this.allCustomers[i].customerId === customer.customerId) {
                this.allCustomers[i] = customer;
                break;
            }
        }
    }

    //设置跟踪后未保存日志状态
    setUnSaveState(contactType,customer,callerPhone) {
        this.storage.set('unSaveState', {
            contactType: contactType,
            customer: customer,
            callerPhone: callerPhone
        }).then(()=> {
            //console.log('set');
        }, (err)=> {
            let error = {
                function: 'setUnSaveState',
                userName: AppConfig.userName,
                logLevel: 16,
                code:0,
                message: err || 'error',
                module: 'SharedModule',
                source: 'customer.service.ts'
            };
            this.writeError(error);
        }).catch((err)=> {
            let error = {
                function: 'setUnSaveState',
                userName: AppConfig.userName,
                logLevel: 16,
                code:0,
                message: err || 'error',
                module: 'SharedModule',
                source: 'customer.service.ts'
            };
            this.writeError(error);
        });
    }

    //获取跟踪后未保存日志状态
    getUnSaveState(){
        return this.storage.get('unSaveState');
    }

    //删除跟踪后未保存日志状态
    removeUnSaveState(){
        this.storage.remove('unSaveState').then(()=> {
            //console.log('remove');
        }, (err)=> {
            let error={
                function:'removeUnSaveState',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err || 'error',
                module:'SharedModule',
                source:'customer.service.ts'
            };
            this.writeError(error);
        }).catch((err)=> {
            let error={
                function:'removeUnSaveState',
                userName:AppConfig.userName,
                logLevel:16,
                code:0,
                message:err || 'error',
                module:'SharedModule',
                source:'customer.service.ts'
            };
            this.writeError(error);
        });
    }

    //今日是否跟踪过
    isTodayTracked() {
        //console.log('isTodayTracked',this.lastTrackDate);
        let date = (new Date()).toLocaleDateString();
        return this.lastTrackDate === date;
    }

    //不可跟踪，拨打电话图标没有
    imgCallShow(status:number) {
        return status !== CustomerStatus.UnTrack;
    }

    //模拟数据
    getCustomerPortraitByHttpSlow(customerId:number):Promise<any> {
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>{
                let result = {
                    isSucceed: true,
                    data: PORTRAITDATA
                };
                return Promise.resolve(result);
            });
    }

    //获取会员画像
    getCustomerPortrait(customerId:number){
        //return this.crmService.getCustomerPortrait(this.orgId,customerId);
        return this.getCustomerPortraitByHttpSlow(customerId);
    }

    //计算客户下一次跟踪时间
    calcNextTrackDate(customerId:number){
        //return this.crmService.calcNextTrackDate(this.orgId,customerId);
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>{
                let result = {
                    isSucceed: true,
                    data: "2018-01-02",
                    code:200,
                    msg:''
                };
                return Promise.resolve(result);
            });
    }


    //获取会员消费结构数据
    getConsumeStructure(param) {
        //return this.crmService.getConsumeStructure(param);
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>{
                let result = {
                    isSucceed: CONSUMESTRUCTURE.isSucceed,
                    code:CONSUMESTRUCTURE.code,
                    data: CONSUMESTRUCTURE.data,
                    msg:''
                };
                return Promise.resolve(result);
            });
    }

    //获取会员购买记录
    getConsumeOrder(param) {
        //return this.crmService.getConsumeOrder(param);
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>{
                let result = {
                    isSucceed: CONSUMEORDER.isSucceed,
                    code:CONSUMEORDER.code,
                    data: CONSUMEORDER.data.slice(0),
                    msg:''
                };
                return Promise.resolve(result);
            });
    }

    //获取会员跟踪日志列表
    getTrackLog(param) {
        //return this.crmService.getTrackLog(param);
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>{
                let result = {
                    isSucceed: TRACKLOG.isSucceed,
                    code:TRACKLOG.code,
                    msg:'',
                    data: this.clone(TRACKLOG.data)
                };
                return Promise.resolve(result);
            });
    }

    //获取操作日志列表
    getOperateLog(param) {
        //return this.crmService.getOperatLog(param);
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>{
                let result = {
                    isSucceed: OPERATLOG.isSucceed,
                    code:OPERATLOG.code,
                    data: OPERATLOG.data,
                    msg:''
                };
                return Promise.resolve(result);
            });
    }

    test(){
        /*this.storage.get('lastTrackDate').then((date)=>{console.log('lastTrackDate:',date)});
        this.storage.forEach( (value, key, index) => {
            console.log(value,key,index);
        })*/
        let a=this.clone(TRACKLOG.data);
        a[0].customerName='123';
        console.log(a,TRACKLOG.data);
    }

    clone(o) {
        if (o instanceof Array) {
            let n = [];
            for (let i = 0; i < o.length; ++i) {
                n[i] = this.clone(o[i]);
            }
            return n;
        } else if (o instanceof Object) {
            let n = {};
            for (let i in o) {
                n[i] = this.clone(o[i]);
            }
            return n;
        } else {
            return o;
        }
    }

    writeError(error){
        console.log(error);
    }

}