/**
 * Created by gobylcy on 2017/2/10.
 */
import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';
import {AppConfig}from'../app/app.config';
import {InterfaceLists}  from './interface_list';
import {PopSer} from './pop-ser';
declare var uxin:any;


/*通话服务
* 通话时长判断
* 通话呼出
* */

@Injectable()
export  class  CallSer{
    constructor(public popser:PopSer,public interface_lists:InterfaceLists,public events: Events) {
    }

    /**
     * 获取通话配置，获取通话余量
     */
    getCallTypeConfig() {
       this.interface_lists.getPersonalityConfig().then((returnData)=>{
            if(returnData.isSucceed){
                //AppConfig.balanceMinute = returnData.data;
                AppConfig.callingType  = returnData.data.callingType;
            }else{
                switch (returnData.code) {
                    case 400:
                        this.popser.alert('请求不合法（请求安全校验没有通过）');
                        break;
                    case 401:
                        this.popser.alert('请求要求身份验证（TOKEN无效）');
                        break;
                    case 405:
                        this.popser.alert('请求被拒绝');
                        break;
                    case 500:
                        this.popser.alert('系统内部异常');
                        break;
                    default:
                        this.popser.alert('数据获取失败，请重试');
                        break;
                }
            }
            this.events.publish('getLogsOk');
        },()=>{
            this.popser.alert('服务器连接失败,请稍后再试');
            this.events.publish('getCallConfEroor');
        })
    }
    uxinRemainMinute(){
        return new Promise((resolve,reject)=>{
            return this.interface_lists.getPersonalityConfig().then((returnData)=>{
                if (returnData.isSucceed) {
                    AppConfig.balanceMinute = returnData.data.balanceMinute;

                    if(AppConfig.balanceMinute<1){
                        reject('免费通话服务不可用,通话分钟数余量不足,请联系管理员');
                    }else{
                        AppConfig.callingType =1;
                        resolve();
                    }
                }else{
                    reject('获取剩余分钟数失败');  //失败
                }
            }, ()=> {
                //alert(66);
                // throw new Error('用户授权信息失败');
                // resolve();
                this.popser.alert('服务器连接失败,请稍后再试'); //失败
                reject("服务器连接失败,请稍后再试");
            })
        })
    }

    //uxin解绑
    UxinCallUnbind(){
        console.log('解绑');
        this.interface_lists.UxinCallUnbind({tel:AppConfig.getUserInfo().mobile}).then((returnData)=>{
            if(returnData.isSucceed){
                // this.popser.alert('解绑成功!');
                console.log('解绑成功!');
            }else {
                // this.popser.alert('解绑失败!');
                console.log("解绑失败");
            }
        },()=>{
            // this.popser.alert('服务器连接失败,请稍后再试');
            console.log('解绑服务器连接失败,请稍后再试');
        });
    }

    //uxin绑定
    uxinBindCall(customer,callback = ()=> {}){
        let bindData:any = {
            "orgId":AppConfig.getUserInfo().orgId,
            "mobile":AppConfig.getUserInfo().mobile,
            "employeeId":AppConfig.getUserInfo().userId
        }
            return this.interface_lists.UxinCallBind(bindData).then((returnData)=>{
                // console.log(returnData);
                // console.log(customer);
                // console.log(uxin);
                if(returnData.isSucceed){
                    uxin.sdk.calling("您的客户:" + customer.customerName,customer.contactMobile, function (msg) {
                    // uxin.sdk.calling("大见",'18558756920', function (msg) {
/*                    //获取随机测试账号
                    let cc=AppConfig.getTestCount();
                    uxin.sdk.calling(cc.name,cc.number, function (msg) {*/
                        // console.log('进入有信');
                        // console.log(msg);
                        msg = JSON.parse(msg);
                        if(msg.event>3){
                            //解绑无法写在这里，在提交日志时解绑 （这里的回调函数无法使用ionic的函数或自定义的函数）
                            // console.log('msg.event>3');
                            // this.UxinCallUnbind();
                        }
                        if (callback != undefined && callback != null && typeof callback == 'function') {
                            callback();
                        }
                    }, function (err) {
                        // console.log('进入有信err');
                        // console.log(err);
                        if(err.indexOf('RECORD_AUDIO')>0){ //说明权限没有打开
                            alert('客满分录音权限没有打开，请在系统设置中找到客满分应用，将录音权限打开！');
                        }
                    });
                }else {
                    this.popser.alert('免费电话手机号绑定失败，请稍后再试');
                }
            }, ()=> {
                this.popser.alert('服务器连接失败,请稍后再试');
            });
    }
}
