import {Injectable} from '@angular/core';
import {AppVersion} from '@ionic-native/app-version';
import {Device} from '@ionic-native/device';
import {Platform} from 'ionic-angular';
import {PopSer} from './pop-ser';
// import {FileSer} from './file-ser';
import {Storage} from '@ionic/storage';
import {AppConfig} from '../app/app.config';
import {InterfaceLists} from '../providers/interface_list';
// import {CustomerService} from '../pages/SharedModule/customer.service';

/**
 * App初始化服务
 */
@Injectable()
export class AppInitSer {
    constructor(public popser:PopSer, public interface_lists:InterfaceLists,
                public appVersion:AppVersion,
                public device:Device,
                public storage:Storage,
                public platform:Platform,
                // public customerService:CustomerService/*,public fileSer:FileSer*/
    ) {
    }

    appInit() {
        //APP信息
        this.setDeviceid();
        this.setPlatform();
        this.setAppName();

        //确定此次app启动的模式  //1首次启动  2.今日首次启动 3普通模式启动
        return new Promise((resolve, reject)=> {
            this.appVersion.getVersionNumber().then((val:string)=> {
                if (val) AppConfig.appVersion = val;
                let dd:any = (new Date()).toLocaleDateString();//今天日期
                this.storage.get('appFirst').then((val)=> {
                    // alert('appFirst'+val);
                    if (val && val == AppConfig.appVersion) {
                        this.storage.get('dayFirst').then((day)=> {
                            if (day && day == dd) {
                                AppConfig.Appmodel = 3;   //普通模式
                            } else {
                                AppConfig.Appmodel = 2;   //日首次模式
                            }
                            //alert(22);
                            resolve();
                        })
                    } else {
                        AppConfig.Appmodel = 1;   //首次启动
                        //alert(2);
                        resolve();
                    }
                });
            }, ()=> {
                // AppConfig.appVersion = '0.0.1';
                //alert(11);
                resolve();
            });
        }).then(()=>{
            //设置 常规配置 （无需登录）
            let promise2:any = this.setConfig();

            //导购用户信息 => 导购配置信息 => 授权信息
            let promise3:any = this.setUserInfo().then(()=> {
                return this.setUserConf();
            }).then(()=> {
                return this.setExpireDate();
            });

            // try{
            //     this.storage.get('lastTrackDate').then((val)=> {
            //         if(val){
            //             this.customerService.lastTrackDate = val;
            //         }
            //     });
            // }catch (e){
            //     console.log(e);
            // }

            /*        //上传错误日志
             this.fileSer.readErrLogs().then((arr)=>{
             this.fileSer.removeFile();
             let num:number=Math.ceil( arr.length / 100);
             for(var x=0;x<num;x++){
             //上传错误
             let index1:number=100*x;
             let index2:number=100*(x+1);
             let arr1:any=arr.slice(index1,index2);

             this.interface_lists.BatchLogs(arr1).then(()=>{

             });
             }
             });*/

            return Promise.all([promise2, promise3]).then(()=> {
                //alert('okall');
                Promise.resolve();
            }, (err)=> {
                //alert('errall');
                this.popser.alert(err);
                Promise.resolve();
            }).catch(err=> console.log(err));
        });
    }

    //设置 设备id
    setDeviceid() {
        AppConfig.deviceId = this.device.uuid ;
        AppConfig.deviceCordova = this.device.cordova;          //设备上运行的Cordova版本
        AppConfig.deviceModel = this.device.model;           //设备型号或产品的名称
        AppConfig.devicePlatform= this.device.platform;          //操作系统名称
        AppConfig.devicePlatformVersion = this.device.version;          //操作系统版本
        AppConfig.deviceManufacturer= this.device.manufacturer;          //设备的制造商
        AppConfig.deviceSerial = this.device.serial;          //设备硬件序列号
    }

    //设置 平台
    setPlatform() {
        if (this.platform.is('ios')) {
            AppConfig.platform = 'ios';
        } else if (this.platform.is('android')) {
            AppConfig.platform = 'android';
        } else {
            AppConfig.platform = '';
        }
    }

    //设置 APP版本号 APP名称
    setAppName() {
        AppConfig.appName = 'CRM_KmfApp';
    }

    //设置 PC调试模式
    setPCmodel() {
        AppConfig.Appmodel = 3;
        AppConfig.platform = 'android';
        AppConfig.appVersion = '0.0.1';
        AppConfig.callingType = 3;
        AppConfig.inited = true;
        AppConfig.balanceMinute = 200;
        AppConfig.showCustomerPhone = true;
    }

    //设置 常规配置 （无需登录）
    setConfig() {
        return new Promise((resolve, reject)=> {
            this.interface_lists.getConfig().then(
                (returnData)=> {
                    if (returnData.isSucceed) {
                        AppConfig.userProtocol = returnData.data.agreement;
                        //alert(3);
                        resolve();
                    }else {
                        //alert(333);
                        resolve();
                        // reject('常规配置信息获取失败，请重新登录');  //失败
                    }
                },()=>{
                    resolve();
                    //alert(33);
                    // reject('常规配置信息获取失败，请重新登录');  //失败
                });
        });
    }

    setAppVersion() {
        return new Promise((resolve, reject)=> {
            this.appVersion.getVersionNumber().then((val:string)=> {
                if (val) {
                    AppConfig.appVersion = val;
                } else {
                    AppConfig.appVersion = '';
                }
                //alert(1)
                resolve();
            }, ()=> {
                AppConfig.appVersion = '0.0.1';
                //alert(11);
                resolve();
            });
        });
    }

    //设置 用户信息
    setUserInfo() {
        return this.storage.get('userInfo').then(
            (userInfo)=> {
                if (userInfo && userInfo != '') {
                    AppConfig.userInfo = JSON.parse(userInfo);
                    AppConfig.token = AppConfig.userInfo.token || '';
                    AppConfig.userName = AppConfig.userInfo.userName || '';
                } else {
                    AppConfig.userInfo = {
                        userId: 0, //用户Id
                        uuid: 0, //全局用户Id
                        userName: '',
                        token: '',
                        orgId: 0,  //会员组织机构Id
                        name: '',  //会员名称
                        mobile: '' //执行人员的联系方式
                    };
                    AppConfig.token = '';
                    AppConfig.userName = '';
                }
                //alert(4);
            });
    }

    //设置 用户配置 （需登录）
    setUserConf() {
        return new Promise((resolve, reject)=> {
            if (AppConfig.token && AppConfig.token != '') {
                this.interface_lists.getPersonalityConfig().then(
                    (returnData)=> {
                        if (returnData.isSucceed && Object.getOwnPropertyNames(returnData.data).length!=0) {
                            AppConfig.callingType = returnData.data.callingType;
                            AppConfig.inited = returnData.data.inited;
                            AppConfig.balanceMinute = returnData.data.balanceMinute;
                            AppConfig.showCustomerPhone = returnData.data.showCustomerPhone;
                            //alert(5);
                            resolve();
                        } else {
                            //alert(55);
                            AppConfig.token='';
                            reject('获取用户配置信息需要重新登录');  //失败
                        }
                    }, ()=> {
                        //alert(55);
                        AppConfig.token='';
                        reject('用户配置信息获取失败，请重新登录');  //失败
                    }
                );
            } else {
                //alert(5);
                resolve();
            }
        });
    }

    //设置 用户授权信息-过期时间 （需登录）
    setExpireDate() {
        return new Promise((resolve, reject)=> {
            if (AppConfig.token && AppConfig.token != '' && AppConfig.userInfo) {
                return this.interface_lists.licenses({orgId: AppConfig.userInfo.orgId, productId: 'KMF'}).then(
                    (returnData)=> {
                        if (returnData.isSucceed && returnData.data[0]) {
                            AppConfig.expireDate = returnData.data[0].expire;
                            //alert(6);
                            resolve();
                        } else {
                            //alert(66);
                            AppConfig.token='';
                            reject('获取用户授权信息需要重新登录');  //失败
                        }

                    }, ()=> {
                        //alert(66);
                        // throw new Error('用户授权信息失败');
                        // resolve();
                        AppConfig.token='';
                        reject('用户授权信息获取失败，请重新登录');  //失败
                    }
                );
            } else {
                //alert(6);
                resolve();
            }
        });

    }


}
