import {Component,ViewChild} from '@angular/core';
import {Platform, ToastController,Nav,IonicApp} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import { CodePush } from 'ionic-native';

//服务
import {AppConfig} from './app.config';
import {Storage} from '@ionic/storage';
import {PopSer} from '../providers/pop-ser';
import {AppInitSer} from '../providers/appInit-ser';
//启动页
import {TabsPage} from '../pages/tabs/tabs';
import {LoginComponent} from '../pages/LoginModule/login/login'
import {BeginGuideComponent} from '../pages/LoginModule/begin-guide/begin-guide';
import {TodayScheduleComponent} from '../pages/LoginModule/today-schedule/today-schedule';
declare  var window;

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    // rootPage = TabsPage;
    // rootPage = LoginComponent;
    // rootPage = BeginGuideComponent;
    // rootPage = TodayScheduleComponent;
    rootPage:any;
    backButtonPressed: boolean = false;  //用于判断返回键是否触发
    @ViewChild('myNav') nav: Nav;


    constructor(public ionicApp: IonicApp,public platform:Platform, public toastCtrl:ToastController, public storage:Storage, public popser:PopSer, public appInitSer:AppInitSer) {
/*
        document.addEventListener("deviceready", ()=>{
            console.log('deviceready');
            console.log(CodePush);
            // 一键更新
            // CodePush.sync().subscribe((syncStatus) =>{
            //     console.log(syncStatus);
            //     CodePush.notifyApplicationReady().then((val)=>{
            //         console.log('notifyApplicationReady');
            //         console.log(val);
            //     });
            // });
            CodePush.notifyApplicationReady().then((val)=>{
                console.log('notifyApplicationReady');
                console.log(val);
            });

            CodePush.checkForUpdate().then((IRemotePackage)=>{
                console.log('checkForUpdate');
                console.log(IRemotePackage);
                if (!IRemotePackage) {
                    console.log("The application is up to date.");
                } else {
                    console.log("A CodePush update is available. Package hash: " + IRemotePackage.packageHash);
                    // IRemotePackage.download(onPackageDownloaded, onError, onProgress);
                    IRemotePackage.download((localPackage)=>{
                        console.log("Package downloaded at: " + localPackage.localPath);
                        // localPackage.install(installSuccess，installError，installOptions);
                        localPackage.install(()=>{
                            console.log("Installation succeeded.");
                            CodePush.notifyApplicationReady().then((val)=>{
                                console.log('notifyApplicationReady');
                                console.log(val);
                            });
                        },(error)=>{
                            console.log("An error occurred. " + error);
                        },null);
                    }, (error)=>{
                        console.log("An error occurred. " + error);
                    }, (downloadProgress)=>{
                        // console.log("Downloading " + downloadProgress.receivedBytes + " of " + downloadProgress.totalBytes + " bytes.");
                    });
                }
            });

            // CodePush.getCurrentPackage().then((packageSuccess)=>{
            //     console.log('获取软件包信息ok');
            //     console.log(packageSuccess);
            // },(packageError)=>{
            //     console.log('获取软件包信息err');
            //     console.log(packageError);
            // }).catch((val)=>{
            //     console.log(val);
            // });

        }, false);*/

        platform.ready().then(() => {

            //极光推送初始化
            if(window.plugins && window.plugins.jPushPlugin){
                alert('极光初始化');
                window.plugins.jPushPlugin.init();
            }
 /*
            if (platform.is('android') || platform.is('ios')) {
                // this.popser.alert('极光初始化');
                console.log('极光初始化');
                // let res:any  = JPush.init();
                // // this.popser.alert(res);
                // console.log(111);
                // console.log(res);
                // console.log(2222);

                // JPush.init().then(()=>{
                //     this.popser.alert('初始化成功');
                // },()=>{
                //     this.popser.alert('初始化失败');
                // });
            }*/

            let promise1:any = this.appInitSer.appInit().then(()=> {
                return new Promise((resolve, reject)=> {
                    if (AppConfig.PCmodel) {
                        this.appInitSer.setPCmodel();
                    }
                    resolve();
                });
            });

            promise1.then(()=> {
                // alert('AppConfig.Appmodel---' + AppConfig.Appmodel);
                // alert('AppConfig.platform---'+AppConfig.platform);
                // alert('AppConfig.deviceid---'+AppConfig.deviceid);
                // alert('AppConfig.appName---'+AppConfig.appName);
                // alert('AppConfig.appVersion---'+AppConfig.appVersion);
                // alert('AppConfig.token---'+AppConfig.token);
                // alert('AppConfig.userName---'+AppConfig.userName);
                // alert('AppConfig.userProtocol---'+AppConfig.userProtocol);
                // alert(AppConfig.userInfo);
                // alert('AppConfig.callingType---'+AppConfig.callingType);
                // alert('AppConfig.inited---'+AppConfig.inited);
                // alert('AppConfig.balanceMinute---'+AppConfig.balanceMinute);
                // alert('AppConfig.showCustomerPhone---'+AppConfig.showCustomerPhone);
                // alert('AppConfig.expireDate---'+AppConfig.expireDate);
                if (AppConfig.Appmodel == 1) {
                    this.rootPage = BeginGuideComponent;
                } else {
                    if(AppConfig.token && AppConfig.token!=''){
                        if (AppConfig.Appmodel == 2) {
                            this.rootPage = TodayScheduleComponent;
                        } else {
                            this.rootPage = TabsPage;
                        }
                    }else {
                        this.rootPage = LoginComponent;
                    }
                }
                StatusBar.styleDefault();
                Splashscreen.hide();
                this.registerBackButtonAction();//注册返回按键事件
            }).catch((err)=>{
                console.log(err);
            });

        });
    }

    //注册安卓物理返回键
    registerBackButtonAction() {
        this.platform.registerBackButtonAction(() => {
            //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
            // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
            let activePortal = this.ionicApp._modalPortal.getActive();
            if (activePortal) {
                activePortal.dismiss().catch(() => {});
                activePortal.onDidDismiss(() => {});
                return;
            }
            console.log('nav');
            console.log(this.nav);
            // 返回当前活动页面的视图控制器
            let activeVC = this.nav.getActive();
            // let tabs = activeVC.instance.tabs;
            let page = activeVC.instance;
            if (!(page instanceof TabsPage)) {
                if (!this.nav.canGoBack()) {
                    return this.showExit();
                }
                return this.nav.pop();
            }
            let tabs = page.tabs;
            // 返回tabs当前选中的选项卡
            let activeNav = tabs.getSelected();
            return activeNav.canGoBack() ? activeNav.pop() : this.showExit()
        }, 1);
    }

    //双击退出App提示框
    showExit() {
        if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
            this.platform.exitApp();
        } else {
            this.toastCtrl.create({
                message: '再按一次退出应用',
                duration: 2000,
                position: 'top'
            }).present();
            this.backButtonPressed = true;
            setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
        }
    }
}




  