import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PopSer}     from '../../../providers/pop-ser';
import {UpdateAppSer}     from '../../../providers/updateApp-ser';
import {AppConfig} from '../../../app/app.config';

@Component({
    selector: 'page-version-info',
    templateUrl: 'version-info.html',
    providers: [PopSer, UpdateAppSer],
})
export class VersionInfoPage {
    public versionNum:string = '';//版本号

    constructor(public navCtrl:NavController, public popser:PopSer, public updateApp:UpdateAppSer) {
    }

    ionViewDidLoad() {
        this.versionNum=AppConfig.appVersion;
    }

    checkUpdate() {
        this.popser.loadingDIY('show', '正在检查新版本...');
        setTimeout(()=> {
            this.popser.loadingDIY('hide');
            this.updateApp.checkUpdate();
        }, 2000)
    }
}
