import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InterfaceLists}  from '../../../providers/interface_list';
import {PopSer}     from '../../../providers/pop-ser';
import {NetworkSer} from '../../../providers/network-ser';
import {AppConfig} from '../../../app/app.config';
/**
 * Generated class for the FindPasswdPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-find-passwd',
  templateUrl: 'find-passwd.html',
})
export class FindPasswdPage {
  mobile:string = '';
  pageIndex:number = 1;//步骤
  userCode:any = '';
  reSendTime:number = 0;//倒计时
  newPassword1:string = '';
  newPassword2:string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,public networkSer:NetworkSer,public interface_lists:InterfaceLists, public popser:PopSer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindPasswdPage');
  }
  goToLogin() {
    this.navCtrl.pop();
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
      // this.popser.alert('手机号输入不正确，<br/>请重新输入');
      this.popser.alert('手机号输入不正确');
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
        this.reSendTime = 0;
        switch (returnData.code) {
          case 600:   //600跳转到系统维护
            // this.navCtrl.push(ServiceMaintenancePage);
            this.popser.alert('系统维护中。。。');
            break;
          case 400:
            this.popser.alert('请求不合法（请求安全校验没有通过）');
            break;
          case 500:
            this.popser.alert('系统内部异常');
            break;
          case 110:
            this.popser.alert('抱歉您的账号未开通，请联系您的管理员');
            break;
          case 111:
            this.popser.alert('验证码发送受限（1分钟之内只能发送1条）');
            break;
          case 112:
            this.popser.alert('验证码发送受限（30分钟之内只能发送3条）');
            break;
          default:
            this.popser.alert('验证码发送失败，请稍后再试');
            break;
        }
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
    if (this.newPassword1 != this.newPassword2) {
      this.popser.alert('两次新密码必须一致！');
      return;
    }
    if (this.newPassword1.length < 6 || this.newPassword2.length < 6) {
      this.popser.alert('新密码不能少于6位！');
      return;
    }
    if(AppConfig.RegExpCn(this.newPassword1)){
      this.popser.alert('不能输入中文或表情哦~');
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
