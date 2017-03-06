import { Injectable } from '@angular/core';

import { HttpSer } from '../../providers/http-ser';

@Injectable()
export class CRMService {
    constructor(private httpser:HttpSer) {
    }

    url:string;
    param:any;

    //获取导购工作台信息
    getWorkSpace() {
        //todo通过服务端请求数据
        this.url = '/crm/seller/workspace';
        return this.httpser.get(this.url);
    }

    //获取品牌信息
    getBrands(orgId:number) {
        this.url = '/crm/brand/get';
        this.param = {
            orgId: orgId
        };
        return this.httpser.post(this.url, this.param);
    }

    //关键字查询
    getKeySearch(param:any) {
        this.url = '/crm/customer/keysearch';
        this.param = param;
        return this.httpser.post(this.url, this.param);
    }


    //获取会员列表
    getCustomers(param:any) {
        this.url = '/crm/customer/get';
        this.param = param;
        return this.httpser.post(this.url, this.param);
    }

    //获取指定会员
    getCustomer(orgId:number, customerId:number) {
        this.url = '/crm/customer/getcustomer';
        this.param = {
            orgId: orgId,
            customerId: customerId
        };
        return this.httpser.post(this.url, this.param);
    }

    //保存跟踪日志
    saveTrackLog(param:any) {
        this.url = '/crm/customer/savetracklog';
        this.param = param;
        return this.httpser.post(this.url, this.param);
    }

    //获取会员画像
    getCustomerPortrait(orgId:number, customerId:number) {
        this.url = '/crm/customer/portrait';
        this.param = {
            orgId: orgId,
            customerId: customerId
        };
        return this.httpser.post(this.url, this.param);
    }

    //计算客户下一次跟踪时间接口
    calcNextTrackDate(orgId:number, customerId:number) {
        this.url = '/crm/customer/CalcNextTrackDate';
        this.param = {
            orgId: orgId,
            customerId: customerId
        };
        return this.httpser.post(this.url, this.param);
    }

    //会员消费结构数据查询接口
    getConsumeStructure(param) {
        this.url = '/crm/customer/consumestructure';
        this.param = param;
        return this.httpser.post(this.url, this.param);
    }

    //会员购买记录查询接口
    getConsumeOrder(param) {
        this.url = '/crm/customer/Orders';
        this.param = param;
        return this.httpser.post(this.url, this.param);
    }


    //会员跟踪日志列表
    getTrackLog(param) {
        this.url = '/crm/customer/tracklogs';
        this.param = param;
        return this.httpser.post(this.url, this.param);
    }

    //操作日志列表接口
    getOperateLog(param) {
        this.url = '/crm/customer/operatlogs';
        this.param = param;
        return this.httpser.post(this.url, this.param);
    }
}