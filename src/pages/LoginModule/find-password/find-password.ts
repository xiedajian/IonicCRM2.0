import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {InterfaceLists}  from '../../../providers/interface_list';
import {SettingPasswordComponent} from '../setting-password/setting-password';
import {PopSer}     from '../../../providers/pop-ser';

/*
 Generated class for the FindPassword page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-find-password',
    templateUrl: 'find-password.html',
})
export class FindPasswordComponent {
    mobile:string = '';
    pageIndex:number = 1;//步骤
    userCode:any = '';
    reSendTime:number = 0;//倒计时
    newPassword1:string = '';
    newPassword2:string = '';

    constructor(public navCtrl:NavController,public interface_lists:InterfaceLists, public popser:PopSer) {
    }

    goToLogin() {
        this.navCtrl.pop();
    }

    goToSettingPassword() {
        this.navCtrl.push(SettingPasswordComponent);
    }

    ionViewDidLoad() {
        // console.log('Hello FindPasswordPage Page');
    }

    go_next() {
        this.pageIndex += 1;
    }

    trim(str) {
        return str.replace(/(^s*)|(s*$)/g, "");
    }

    //验证手机号
    check_mobile() {
        var myreg = /^\s*(1\d{10})\s*$/;
        if (!myreg.test(this.trim(this.mobile))) {
            this.popser.alert('您输入的手机号不正确，请重新输入');
            return;
        }
        this.go_next();
        //发送验证码
        // this.sendCode();
    }

    check_code() {
        if (this.userCode == '') {
            this.popser.alert('验证码不能为空');
            return
        }
        this.interface_lists.checkCode({userName:this.mobile,validCode:this.userCode}).then((returnData)=>{
            if (returnData.isSucceed) {
                this.go_next();
            }else {
                this.popser.alert('验证码不正确');
            }
        },()=>{
            this.popser.alert('服务器连接失败，请稍后再试');
        });
    }

    //倒计时开始
    start_Time() {
        this.reSendTime = 60;
        let t = setInterval(()=> {
            this.reSendTime--;
            if (this.reSendTime == 0) {
                window.clearInterval(t);
            }
        }, 1000);
    }

    //重新发送
    reSendCode() {
        this.sendCode();
    }

    sendCode() {
        // 发送验证码
        this.interface_lists.sendCode({userName:this.mobile,codeType:0}).then((returnData)=>{
            if (returnData.isSucceed) {
                this.start_Time();
            }else {
                this.popser.alert('验证码发送失败，请稍后再试');
                this.reSendTime = 0;
            }
        },()=>{
            this.popser.alert('服务器连接失败，请稍后再试');
            this.reSendTime = 0;
        });
    }


    setNewPassword() {
        if (this.newPassword1 == '' || this.newPassword2 == '') {
            this.popser.alert('新密码不能为空！');
            return;
        }
        if (this.newPassword1.length < 6 || this.newPassword2.length < 6) {
            this.popser.alert('新密码不能少于6位！');
            return;
        }
        if (this.newPassword1 != this.newPassword2) {
            this.popser.alert('两次新密码必须一致！');
            return;
        }
        //重置
        this.interface_lists.resetPasswd({userName:this.mobile,newPassword:this.newPassword1}).then((returnData)=>{
            if (returnData.isSucceed) {
                this.popser.alert('密码重置成功,请重新登录',()=>{
                    this.navCtrl.pop();
                });
            }else {
                this.popser.alert('密码重置失败，请稍后再试');
            }
        },()=>{
            this.popser.alert('服务器连接失败，请稍后再试');
        });
    }
}
