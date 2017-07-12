import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';

//import { HttpSer } from '../../providers/http-ser';
import {Customer} from './customer.model';
import {CustomerLevel,TrackDateCalcType,CustomerStatus,TrackResult} from './enum';
import {CRMService} from './crm.service';
import {PopSer} from '../../providers/pop-ser';
import {AppConfig} from'../../app/app.config';



@Injectable()
export class CustomerService {
    constructor(public crmService:CRMService,public storage:Storage,public popSer:PopSer) {
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
    total:number=0;
    //是否显示结束
    isEnd:boolean;
    //是否加载完成
    isLoad:boolean = false;
    //是否提示搜索结果
    searchTip:boolean = false;
    timeoutId:any;
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


    //获取会员列表
    getCustomers(param:any,event:any,type:string="") {
        this.crmService.getCustomers(param).then(result=> {
            if (result.isSucceed) {
                // console.log(param, result);
                if (!result.data) {
                    result.data = [];
                    result.total = 0;
                }
                if (result.data.length <= 0) {
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
                    this.popSer.loadOn(this.isLoad);
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
                if (param.pageIndex == 1 && type!="sort") {
                    if (this.timeoutId) {
                        clearTimeout(this.timeoutId);
                    }
                    this.searchTip = true;
                    //console.log('bb',this.searchTip);
                    this.timeoutId = setTimeout(() => {
                        this.searchTip = false;
                        //console.log('aa',this.searchTip);
                    }, 2000);
                }
                if (event != null) {
                    event.complete();
                }
            }
            else {
                this.isLoad = true;
                this.popSer.loadOn(this.isLoad);
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
            this.isLoad = true;
            this.popSer.loadOn(this.isLoad);
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


    //获取指定会员
    getCustomer(orgId:number,customerId:number) {
        return this.crmService.getCustomer(orgId, customerId);
        //return this.getCustomerByHttpSlow(customerId);
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
            callerPhone: callerPhone,
            userId :AppConfig.userInfo.userId
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


    //获取会员画像
    getCustomerPortrait(customerId:number){
        return this.crmService.getCustomerPortrait(AppConfig.userInfo.orgId,customerId);
    }

    //计算客户下一次跟踪时间
    calcNextTrackDate(customerId:number){
        return this.crmService.calcNextTrackDate(AppConfig.userInfo.orgId,customerId);
    }


    //获取会员消费结构数据
    getConsumeStructure(param) {
        return this.crmService.getConsumeStructure(param);
    }

    //获取会员购买记录
    getConsumeOrder(param) {
        return this.crmService.getConsumeOrder(param);
    }

    //获取会员跟踪日志列表
    getTrackLog(param) {
        return this.crmService.getTrackLog(param);
    }

    //获取操作日志列表
    getOperateLog(param) {
        return this.crmService.getOperateLog(param);
    }

    testUxin() {
        this.crmService.testUxin(AppConfig.userInfo.orgId, AppConfig.userInfo.userId, '15059128691');
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