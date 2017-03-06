import {Injectable} from '@angular/core';
import {HttpSer} from './http-ser';
import {APP_SERVE_URL} from '../app/app.config';


/**
 * App接口列表
 */
@Injectable()
export class InterfaceLists {

    constructor(private httpser:HttpSer) {
        // console.log('Hello InterfaceLists Provider');
    }

    /**
     *  4.1	App版本检测接口
     * @param   data:{version:1}
     * @returns Promise
     */
    AppVersionCheck(data) {
        let url = APP_SERVE_URL + '/System/AppVersion/Check';
        return this.httpser.post(url, data);
    }

    /**
     *  4.6 登录
     * @param   data:{userName:'大见',password:'123456'}
     * @returns Promise
     */
    login(data) {
        let url = APP_SERVE_URL + '/System/Security/Login';
        return this.httpser.login(url, data);
    }

    /**
     * 5.1.3 获取常规配置信息
     * @param   data:{}
     * @returns Promise
     */
    getConfig() {
        let url = APP_SERVE_URL + '/system/config/get';
        return this.httpser.get(url, {});
    }

    /**
     * 4.2 获取导购个性配置信息
     * @param   data:{}
     * @returns Promise
     */
    getPersonalityConfig() {
        let url = APP_SERVE_URL + '/crm/config/profile';
        return this.httpser.get(url, {});
    }

    /**
     *  4.5 授权信息
     * @param   data:{orgId:28,productId:'KMF'}
     * @returns Promise
     */
    licenses(data) {
        let url = APP_SERVE_URL + '/System/License/Licenses';
        return this.httpser.get(url, data);
    }

    /**
     *  4.4 系统公告信息
     * @param   data:{orgId:28}
     * @returns Promise
     */
    notice(data) {
        let url = APP_SERVE_URL + '/system/notice/get';
        return this.httpser.get(url, data);
    }

    /**
     * 5.2.13 查询剩余分钟数
     * @param   data:{orgId:28}
     * @returns Promise
     */
    communicateminute(data) {
        let url = APP_SERVE_URL + '/crm/customer/communicateminute';
        return this.httpser.post(url, data);
    }

    /**
     *  导购工作台接口
     * @param   data:{}
     * @returns Promise
     */
    workspace() {
        let url = APP_SERVE_URL + '/crm/seller/workspace';
        return this.httpser.post(url, {});
    }

    /**
     * 4.8 发送验证码
     * @param   data:{userName:'18512345678',codeType:0}
     * @returns Promise
     */
    sendCode(data) {
        let url = APP_SERVE_URL + '/System/Sms/SendCode';
        return this.httpser.post(url, data);
    }

    /**
     *  4.10 检查验证码
     * @param   data:{userName:'大见',validCode:'8888'}
     * @returns Promise
     */
    checkCode(data) {
        let url = APP_SERVE_URL + '/System/Security/CheckValidCode';
        return this.httpser.post(url, data);
    }

    /**
     *  4.11	错误日志提交接口
     * @param   data:【{function:'login',userName:'18512345678',logLevel:1,message:'登录出错',module:'登录模块',source:''},{...}】
     * @returns Promise
     */
    BatchLogs(data){
        let url = APP_SERVE_URL + '/System/Logs/BatchLogs';
        return this.httpser.post(url, data);
    }

    /**
     *  4.9 重置密码
     * @param   data:{userName:'大见',newPassword:'123456'}
     * @returns Promise
     */
    resetPasswd(data) {
        let url = APP_SERVE_URL + '/System/Security/ResetPasswd';
        return this.httpser.setNewPassword(url, data);
    }

    /**
     *  4.7 修改密码
     * @param   data:{userName:'大见',password:'123456',newPassword:'654321'}
     * @returns Promise
     */
    updatePasswd(data) {
        let url = APP_SERVE_URL + '/System/Security/ModifyPassword';
        return this.httpser.setNewPassword(url, data);
    }

    /**
     *  5.1.2    导购跟踪效率
     * @param   data:{intdate:20170106}
     * @returns Promise
     */
    overview(data) {
        let url = APP_SERVE_URL + '/crm/seller/overview';
        return this.httpser.post(url, data);
    }


    /**
     * 5.2.4    会员画像接口
     * @param   data:{orgId:28,customerId:3}
     * @returns Promise
     */
    portrait(data) {
        let url = APP_SERVE_URL + '/crm/customer/portrait';
        return this.httpser.post(url, data);
    }


    /**
     * 5.2.5    关闭会员跟踪接口
     * @param   data:{orgId:1,customerId:2，remark:"不肯接电话"}
     * @returns Promise
     */
    disabledtracking(data) {
        let url = APP_SERVE_URL + '/crm/customer/disabledtracking';
        return this.httpser.post(url, data);
    }

    /**
     * 5.2.6    设置下次跟踪时间/启用会员跟踪接口
     * @param   data:{orgId:1,customerId:2.customerId,nextTrackDate:"2016-10-05"}
     * @returns Promise
     */
    settracking(data) {
        let url = APP_SERVE_URL + '/crm/customer/settracking';
        return this.httpser.post(url, data);
    }

    /**
     * 5.2.7    设置跟踪时间计算方式接口
     * @param   data:{orgId:1,customerId:2.customerId,trackDateCalcType:1}
     * @returns Promise
     */
    settrackdatecalctype(data) {
        let url = APP_SERVE_URL + '/crm/customer/settrackdatecalctype';
        return this.httpser.post(url, data);
    }

    /**
     * 5.2.8    计算客户下一次跟踪时间接口
     * @param   data:{orgId:1,customerId:2}
     * @returns Promise
     */
    CalcNextTrackDate(data) {
        let url = APP_SERVE_URL + '/crm/customer/CalcNextTrackDate';
        return this.httpser.post(url, data);
    }

    /**
     * 5.2.9    会员消费结构数据查询接口
     * @param   data:{orgId:28,customerId:3,structType:1}
     * @returns Promise
     */
    consumeStructure(data) {
        let url = APP_SERVE_URL + '/crm/customer/consumestructure';
        return this.httpser.post(url, data);
    }


    /**
     * 5.2.10    会员购买记录查询接口
     * @param   data:{orgId:28,customerId:3,pageIndex:1,pageSize:10}
     * @returns Promise
     */
    consumeOrder(data) {
        let url = APP_SERVE_URL + '/crm/customer/Orders';
        return this.httpser.post(url, data);
    }

    /**
     * 5.2.11    会员跟踪日志列表
     * @param   data:{orgId:28,customerId:3,employeeId:3,trackResult:'2,3,4',pageIndex:1,pageSize:10}
     * @returns Promise
     */
    tracklogs(data) {
        let url = APP_SERVE_URL + '/crm/customer/tracklogs';
        return this.httpser.post(url, data);
    }

    /**
     * 5.2.12    操作日志列表接口
     * @param   data:{orgId:28,customerId:3}
     * @returns Promise
     */
    operatlogs(data) {
        let url = APP_SERVE_URL + '/crm/customer/operatlogs';
        return this.httpser.post(url, data);
    }

    /**
     * 5.2.13  获取通话类型配置
     * @param data:{orgId:28}
     * @returns Promise
     */
     getCallConf(data){
        let url = APP_SERVE_URL + '/YtxApp/YtxApi/GetVoiceConfig';
        return this.httpser.post(url,data);
    }

    /**
     * 5.2.14  绑定有信
     * @param data:{tel:"18073118015",orgId:28,employeeId:1512}
     * @returns Promise
     */
    UxinCallBind(data){
        let url = 'http://hybapi.ipvp.cn/v1/YtxApp/YtxApi/GetBind';
        return this.httpser.get(url,data);
    }

    /**
     * 5.2.15  解绑有信
     * @param data:{tel:"18073118015"}
     * @returns Promise
     */
    UxinCallUnbind(data){
        let url = 'http://hybapi.ipvp.cn/v1/YtxApp/YtxApi/Unbind';
        return this.httpser.get(url,data);
    }

    /**
     * 5.2.16   获取剩余分钟数
     * @param data:{tel:"18073118015"}
     * @returns Promise
     */
    getRemainTimes(){
        let url = APP_SERVE_URL + '/crm/config/profile';
        return this.httpser.post(url);
    }



}

