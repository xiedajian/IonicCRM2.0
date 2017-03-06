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
       this.interface_lists.getCallConf({orgId:AppConfig.getUserInfo().orgId}).then((returnData)=>{
            if(returnData.isSucceed){
                //AppConfig.balanceMinute = returnData.data;
                AppConfig.callingType  = returnData.data.Voice_Type;
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
    uxinBindCall(customer){
        let bindData:any = {
            "tel":AppConfig.getUserInfo().mobile,
            "orgId":AppConfig.getUserInfo().orgId,
            "employeeId":AppConfig.getUserInfo().userId
        }
        return new Promise((resolve,reject)=>{
            return this.interface_lists.UxinCallBind(bindData).then((returnData)=>{
                if(returnData.IsSucceed){
                    uxin.sdk.calling("您的客户:" + customer.name,customer.telphone, function (msg) {
                        //弹出日志填写框
                        //alert(msg);
                        msg = JSON.parse(msg);
                        if(msg.event>3){
                            this.interface_lists.UxinCallUnbind({tel:AppConfig.getUserInfo().mobile}).then((returnData)=>{
                                if(returnData.IsSucceed){
                                   this.popser.alert('解绑成功!');
                                    resolve();
                                }else {
                                    this.popser.alert('解绑失败!');
                                    reject("解绑失败");
                                }
                            },()=>{
                                this.popser.alert('服务器连接失败,请稍后再试');
                                reject("服务器连接失败,请稍后再试");
                            });
                        }
                    }, function (err) {
                        //$scope.targetValue += err;
                        if(err.indexOf('RECORD_AUDIO')>0){ //说明权限没有打开
                            this.popser.alert('客满分录音权限没有打开，请在系统设置中找到客满分应用，将录音权限打开！')
                            reject("客满分录音权限没有打开，请在系统设置中找到客满分应用，将录音权限打开！");
                        }
                    });
                }
            }, ()=> {
                this.popser.alert('服务器连接失败,请稍后再试');
                reject("服务器连接失败,请稍后再试");
            })
        })
    }
}
