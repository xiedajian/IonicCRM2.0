import {Component,ViewChild} from '@angular/core';
import {Platform, ToastController,Nav,IonicApp} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import { CodePush } from 'ionic-native';
//服务
import {AppConfig} from './app.config';
import {Storage} from '@ionic/storage';
import {PopSer} from '../providers/pop-ser';
import {AppInitSer} from '../providers/appInit-ser';
import {NetworkSer} from '../providers/network-ser';

//启动页
import {TabsPage} from '../pages/tabs/tabs';
import {LoginComponent} from '../pages/LoginModule/login/login'
import {BeginGuideComponent} from '../pages/LoginModule/begin-guide/begin-guide';
import {TodayScheduleComponent} from '../pages/LoginModule/today-schedule/today-schedule';
// import { JPushService } from 'ionic2-jpush';
declare var uxin: any;
declare var window;
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any;
    backButtonPressed: boolean = false;  //用于判断返回键是否触发
    @ViewChild('myNav') nav: Nav;

    constructor(public ionicApp: IonicApp,public platform:Platform,/*private jPushPlugin: JPushService,*/ public toastCtrl:ToastController, public storage:Storage, public popser:PopSer, public appInitSer:AppInitSer,public networkSer:NetworkSer) {

        platform.ready().then(() => {

            this.platform.pause.subscribe(()=>{console.log('app进入后台')});
            this.platform.resume.subscribe(()=>{console.log('app激活')});

            let promise1:any = this.appInitSer.appInit().then(()=> {
                return new Promise((resolve, reject)=> {
                    console.log(AppConfig.userInfo);
                    //极光推送初始化
                    if(window.plugins && window.plugins.jPushPlugin){
                        console.log('极光初始化');
                        window.plugins.jPushPlugin.init();
                        window.plugins.jPushPlugin.getRegistrationID(function(data) {
                            console.log("JPushPlugin:registrationID is " + data);
                            if(data && data!=''){
                                AppConfig.jPushRegistrationId=data;
                                // alert( '极光初始化ok');
                                if (AppConfig.token && AppConfig.token != '' && AppConfig.userInfo) {
                                    // window.plugins.jPushPlugin.setAlias('别名');
                                    // window.plugins.jPushPlugin.setTags('标签');
                                    // window.plugins.jPushPlugin.setAlias('CRM_KmfApp_111111');
                                    window.plugins.jPushPlugin.setAlias(AppConfig.userInfo.userId);
                                    window.plugins.jPushPlugin.setAlias(AppConfig.userInfo.mobile);
                                    window.plugins.jPushPlugin.setTags(['orgId_'+AppConfig.userInfo.orgId]);
                                    AppConfig.jPushAlias=AppConfig.userInfo.userId+','+AppConfig.userInfo.mobile;
                                    AppConfig.jPushTags='orgId_'+AppConfig.userInfo.orgId;
                                    console.log('极光设置别名ok');
                                }
                            }else {
                                console.log('极光初始化error');
                            }
                        });
                    }else {
                        console.log('没有检测到极光插件');
                    }
                    if (AppConfig.PCmodel) {
                        this.appInitSer.setPCmodel();
                    }
                    resolve();
                });
            });
            promise1.then(()=> {
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
                this.registerBackButtonAction();//注册返回按键事件
                setTimeout(()=>{
                    StatusBar.styleDefault();
                    Splashscreen.hide();
                },2000);
            }).catch((err)=>{
                console.log(err);
            });
        });

        document.addEventListener("deviceready", ()=>{
            //极光推送----------------------

/*            //极光推送初始化
            if(window.plugins && window.plugins.jPushPlugin){
                console.log('极光初始化');
                window.plugins.jPushPlugin.init();
                window.plugins.jPushPlugin.getRegistrationID(function(data) {
                    console.log("JPushPlugin:registrationID is " + data)
                })
                window.plugins.jPushPlugin.setAlias('别名');
                window.plugins.jPushPlugin.setTags('标签');
                console.dir(window.plugins.jPushPlugin);
            }else {
                console.log('极光检测失败');
            }*/

            /*            this.jPushPlugin.init()
             .then(res => alert(res))
             .catch(err => alert(err));*/
            // console.dir(this.jPushPlugin);

            //热更新----------------------
            platform.ready().then(()=>{
                if (this.platform.is('android')) {
                    // 一键更新
                    CodePush.sync().subscribe((syncStatus) =>{
                        console.log(syncStatus);
                    });
                }
            });

            /*CodePush.checkForUpdate().then((IRemotePackage)=>{
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
            });*/

            // CodePush.getCurrentPackage().then((packageSuccess)=>{
            //     console.log('获取软件包信息ok');
            //     console.log(packageSuccess);
            // },(packageError)=>{
            //     console.log('获取软件包信息err');
            //     console.log(packageError);
            // }).catch((val)=>{
            //     console.log(val);
            // });

            // 网络监测------------------------------------------
            this.networkSer.startNetDetect();

        }, false);
    }

    //注册安卓物理返回键
    registerBackButtonAction() {
        this.platform.registerBackButtonAction(() => {
            //如果有弹窗或loading，返回键什么也不做
            let activeLoading=this.ionicApp._loadingPortal.getActive();
            let activeOverlay=this.ionicApp._overlayPortal.getActive();
            if(activeLoading || activeOverlay){
                return;
            }
            //处理modal
            let activeModal= this.ionicApp._modalPortal.getActive();
            if (activeModal) {
                activeModal.dismiss().catch(() => {});
                activeModal.onDidDismiss(() => {});
                return;
            }
            // 返回当前活动页面的视图控制器
            let activeVC = this.nav.getActive();
            let page = activeVC.instance;
            // console.log(page);
            // console.log(page instanceof TabsPage);
            // console.log(page instanceof LoginComponent);
            // console.log(page instanceof TodayScheduleComponent);
            // console.log(this.nav.canGoBack());
            //如果当前页面不是tabs页面
            if (!(page instanceof TabsPage)) {
                if (page instanceof LoginComponent ||  page instanceof TodayScheduleComponent || !this.nav.canGoBack() ) {
                    return this.showExit();
                }
                return this.nav.pop();
            }
            let tabs = page.tabs;
            // 返回tabs当前选中的选项卡
            let activeNav = tabs.getSelected();
            return activeNav.canGoBack() ? activeNav.pop() : this.showExit();
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




  