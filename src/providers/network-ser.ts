import {Injectable} from '@angular/core';
import {PopSer} from './pop-ser';
import {Network} from "ionic-native";

/**
 * App网络监测服务
 */
@Injectable()
export class NetworkSer {

    constructor(public popser:PopSer) {
        console.log('Hello NetWork Provider');
    }
    /**
     * 提示网络类型
     */
    checkNetwork() {
        this.popser.loadingDIY('show', '网络检测中...');
        setTimeout(() => {
            this.popser.loadingDIY('hide');
            this.showNetworkStatus();
        }, 1000);
    }
    /**
     * 网络类型
     * unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
     */
    showNetworkStatus() {
        if (Network.type == 'unknown') {
            this.popser.alert('This is a unknown network!');
        } else if (Network.type == 'none') {
            this.popser.alert('none network!');
        } else {
            this.popser.alert(Network.type);
        }
    }

    isConnected:boolean=true;
    disconnectSubscription:any;
    connectSubscription:any;
    /**
     * 开启网络监测
     */
    startNetDetect() {
        this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
            this.isConnected=false;
            this.popser.alert('网络断开了');
        });
        // （停止断网检测）
        // disconnectSubscription.unsubscribe();

        this.connectSubscription = Network.onConnect().subscribe(() => {
            console.log('network connected!');
            this.isConnected=true;
            setTimeout(() => {
                this.showNetworkStatus();
            }, 1000);
        });

        // （停止联网检测）
        // connectSubscription.unsubscribe();
    }

    stopNetDetect(){
        this.disconnectSubscription.unsubscribe();
        this.connectSubscription.unsubscribe();
    }

    test(){
        setTimeout(() => {
            this.isConnected=!this.isConnected;
        }, 5000);
    }

}
