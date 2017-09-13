import { Injectable } from '@angular/core';

import { HttpSer } from '../../providers/http-ser';
import {AppVersion,Config,Notice,Licenses,User} from './system.model';

@Injectable()
export class SystemService {
    constructor(private httpser: HttpSer) {
    }
    url:string;
    param:any;

    //App版本检测
    checkAppVersion(version:number): AppVersion {
        //todo通过服务端请求数据
        let appVersion:AppVersion;
        this.url = '/System/AppVersion/Check';
        this.param = {
            version: version
        };
        this.httpser.post(this.url, this.param).then(data => appVersion = data);
        return appVersion
    }

    //获取配置信息
    getConfig(orgId:number):Config {
        let config:Config;
        this.url = '/system/config/get';
        this.param = {
            orgId: orgId
        }
        this.httpser.post(this.url, this.param).then(data => config = data);
        return config
    }

    //获取公告信息
    getNotice(orgId:number):Notice {
        let notice:Notice;
        this.url = '/system/notice/get';
        this.param = {
            orgId: orgId
        }
        this.httpser.post(this.url, this.param).then(data => notice = data);
        return notice
    }

    //获取产品授权信息
    getLicenses(orgId:number,productId?:string):Licenses[] {
        let licenses:Licenses[];
        this.url = '/System/License/Licenses';
        this.param = {
            orgId: orgId,
            productId: productId
        }
        this.httpser.post(this.url, this.param).then(data => licenses = data);
        return licenses
    }

    //登陆App
    login(userName:string,password:string):User {
        let user:User;
        this.url = '/System/Security/Login';
        this.param = {
            userName: userName,
            password: password
        }
        this.httpser.post(this.url, this.param).then(data => user = data);
        return user
    }

    //发送验证码
    sendCode(userName:string,codeType:number):void {
        this.url = '/System/Sms/SendCode';
        this.param = {
            userName: userName,
            codeType: codeType
        }
        this.httpser.post(this.url, this.param).then(()=>null);
    }

    //重置账号密码
    resetPassword(userName:string,newPassword:string,validCode:string):void {
        this.url = '/System/Security/ResetPasswd';
        this.param = {
            userName: userName,
            newPassword: newPassword,
            validCode: validCode
        }
        this.httpser.post(this.url, this.param).then(()=>null);
    }
}