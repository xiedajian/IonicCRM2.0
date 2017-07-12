import {Injectable} from '@angular/core';
import {FileOpener} from '@ionic-native/file-opener';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { LoadingController } from 'ionic-angular';
import {AppConfig} from '../app/app.config';
import {InterfaceLists} from './interface_list';
import {PopSer} from './pop-ser';
declare var cordova;
/**
 * App更新升级服务
 */
@Injectable()
export class UpdateAppSer {
    constructor(
                private transfer: Transfer,
                private file: File,
                public fileOpener:FileOpener,
                public popser:PopSer,
                public loadingCtrl: LoadingController,
                public interface_lists:InterfaceLists) {
    }

    /**
     * 一键自动升级
     */
    checkUpdate() {
        this.interface_lists.AppVersionCheck({version:AppConfig.getAppVersion()}).then(
            (returnData)=>{
                // console.log(returnData);
                if (returnData.isSucceed) {
                    if(returnData.data.hasNewVersion){
                        //版本升级提示框
                        this.update_notice(returnData);
                    }else {
                        this.popser.alert('当前已经是最新版本');
                    }
                }else {
                    this.popser.alert('新版本检测失败,请稍后再试');
                }
            },()=> {
                this.popser.alert('新版本检测服务器连接失败,请稍后再试');
            });

/*        //模拟数据
        let returnData:any = {
            code: 0,
            isSucceed: true,
            data: {
                hasNewVersion: true,
                version: 1000010,
                versionCode: '1.0.10',
                upgradeUrl: 'http://192.168.1.103/kmf.apk',
                releaseTips: '修复bug.xxxx'
            }
        }
        if (returnData.isSucceed) {
            if(returnData.data.hasNewVersion){
                //版本升级提示框
                this.update_notice(returnData);
            }else {
                this.popser.alert('当前已经是最新版本');
            }
        }else {
            this.popser.alert('新版本检测失败,请稍后再试');
        }*/
    }

    /**
     * 新版本更新提示框
     */
    update_notice(returnData) {
        let platform:string=AppConfig.getPlatform();
        if (platform=='ios') {
            // let obj:any = {
            //     title: '<div class="setup_img"><img  src="img/setup.png" class="img"/><p class="content">' + returnData.data.versionCode + '版本更新</p></div>',
            //     content: '<ul>' + returnData.data.releaseTips + '</ul>',
            //     okText: '我知道了'
            // };
            // this.popser.alertDIY(obj, ()=> {
            //     // window.open('itms-apps://itunes.apple.com/us/app/拼单网-客满分/id1138683564?l=zh&ls=1&mt=8');
            //     console.log('知道了');
            // });
            //强制更新
            if(returnData.data.forceUpgrade){
                this.popser.update_forceUpgrade({
                    appVersionNumber: returnData.data.versionCode,
                    content: returnData.data.releaseTips,
                    okText:'请前往AppStore更新,旧版本将不再提供技术支持'
                }, ()=> {
                    this.popser.loadingDIY('show','请前往AppStore更新app，旧版本不再提供技术支持');
                });
            } else {
                this.popser.update({
                    appVersionNumber: returnData.data.versionCode,
                    content: returnData.data.releaseTips,
                    okText:'我知道了'
                });
            }
        } else if (platform=='android') {
            //强制更新
            if(returnData.data.forceUpgrade){
                this.popser.update_forceUpgrade({
                    appVersionNumber: returnData.data.versionCode,
                    content: returnData.data.releaseTips
                }, ()=> {
                    this.upgradeApp(returnData.data.upgradeUrl,returnData.data.versionCode);
                });
            }else {
                this.popser.update({
                    appVersionNumber: returnData.data.versionCode,
                    content: returnData.data.releaseTips,
                }, ()=> {
                }, ()=> {
                    this.upgradeApp(returnData.data.upgradeUrl,returnData.data.versionCode);
                });
            }
        } else {
            console.log("I'm an 未知 device!");
            // let obj:any = {
            //     title: '<div class="setup_img"><img  src="img/setup.png" class="img"/><p class="content">' + returnData.data.versionCode + '版本更新</p></div>',
            //     content: '<ul>' + returnData.data.releaseTips + '</ul>',
            //     okText: '我知道了'
            // };
            // this.popser.alertDIY(obj, ()=> {
            //     console.log("I'm an 未知 device!");
            // });
            this.popser.update({
                appVersionNumber: returnData.data.versionCode,
                content: returnData.data.releaseTips,
                okText:'我知道了'
            });
        }
    }


    /**
     * 下载与打开
     */
    upgradeApp(url,versionCode) {
        const fileTransfer: TransferObject = this.transfer.create();
        let uploading = this.loadingCtrl.create({
            content: "正在下载...",
            dismissOnPageChange: false
        });
        uploading.present();
        
        // var targetPath = "/sdcard/Download/kmf2.0-upd.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
        var targetPath = cordova.file.externalDataDirectory +"/kmf"+versionCode+"-upd.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
        // var options = {};

        fileTransfer.download(url, targetPath).then(
            (entry) => {
                uploading.dismiss();
                this.fileOpener.open(targetPath, 'application/vnd.android.package-archive').then();
            }, (error) => {
                uploading.dismiss();
                this.popser.alert('下载失败,请重试或到应用市场下载最新版本');
            }
        );

        fileTransfer.onProgress((event)=>{
            //进度，这里使用文字显示下载百分比
            let downloadProgress:number = (event.loaded / event.total) * 100;
            uploading.setContent("安装包已经下载：" + Math.floor(downloadProgress) + "%...");
            if (downloadProgress > 99) {
                // uploading.destroy();
                uploading.dismiss();
            }
        });


    }


}
