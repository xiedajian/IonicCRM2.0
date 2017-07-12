import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppConfig} from '../../../app/app.config';
import {PopSer}     from '../../../providers/pop-ser';
import {InterfaceLists}  from '../../../providers/interface_list';
import {NetworkSer} from '../../../providers/network-ser';

/**
 * Generated class for the ChangePassswdPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-change-passswd',
  templateUrl: 'change-passswd.html',
})
export class ChangePassswdPage {
  public oldPassword:string = '';
  public newPassword:string = '';
  public newPassword2:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,public networkSer:NetworkSer,public interface_lists:InterfaceLists, private popser:PopSer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePassswdPage');
  }

  goSetPassword() {
    if (this.oldPassword == '' || this.oldPassword.length < 6) {
      this.popser.alert('原密码格式错误');
      return;
    }
    if (this.newPassword == '' || this.newPassword2 == '') {
      this.popser.alert('新密码不能为空');
      return;
    }
    if (this.newPassword != this.newPassword2) {
      this.popser.alert('两次新密码输入不一致');
      return;
    }
    if (this.newPassword.length < 6 || this.newPassword2.length < 6) {
      this.popser.alert('新密码不能少于6位！');
      return;
    }
    if(AppConfig.RegExpCn(this.oldPassword) ||AppConfig.RegExpCn(this.newPassword)  ){
      this.popser.alert('不能输入中文或表情哦~');
      return;

    }
    this.interface_lists.updatePasswd({userName:AppConfig.userName,password:this.oldPassword,newPassword:this.newPassword}).then((returnData)=>{
      if (returnData.isSucceed) {
        this.popser.alert('修改密码成功，建议用新密码重新登录',()=>{
          this.navCtrl.pop();
        });
      }else {
        switch (returnData.code) {
          case 101:
            this.popser.alert('原密码错误');
            break;
          case 400:
            this.popser.alert('请求不合法（请求安全校验没有通过）');
            break;
          case 401:
            this.popser.alert('请求要求身份验证（TOKEN无效）');
            this.navCtrl.parent.parent.setRoot('LoginPage');
            break;
          case 405:
            this.popser.alert('请求被拒绝');
            break;
          case 500:
            this.popser.alert('系统内部异常');
            break;
          default:
            this.popser.alert('密码修改失败，请重试');
            break;
        }
      }
    },()=>{
      this.popser.alert('服务器连接失败，请稍后再试');
    });

    // console.log(this.oldPassword);
    // console.log(this.newPassword);
    // console.log(this.newPassword2);
  }
}
