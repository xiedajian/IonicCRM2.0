import 'rxjs';
import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {InterfaceLists}  from '../../../providers/interface_list';
import {PopSer} from '../../../providers/pop-ser';
import {NetworkSer} from '../../../providers/network-ser';
import {FileSer} from '../../../providers/file-ser';
import {AppConfig} from '../../../app/app.config';
import {TodayScheduleComponent} from '../today-schedule/today-schedule';
import {FindPasswordComponent} from '../find-password/find-password';
// declare  var CryptoJS;  /*AES加密*/
// declare  var RSAUtils;  /*RSA加密*/
declare var uxin: any;
// import{Directive, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef} from 'angular2/core';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginComponent {
    alias: string = '';
    msgList: Array<any> = [];
    userName: string = '';
    password: string = '';
    registrationId: string;

    constructor(public navCtrl: NavController,
                public interface_lists: InterfaceLists,
                public networkSer:NetworkSer,
                public popser: PopSer,
                public platform: Platform,
                public storage: Storage/*,public fileSer:FileSer*/) {
        AppConfig.token = '';
        AppConfig.userName = '';
        AppConfig.userInfo = {};
        storage.remove('userInfo');
        this.storage.get('UserProtocol').then(
            (val) => {
                if (val && val == 'yes') {
                } else {
                    this.presentLoadingText();
                }
            }
        );
    }

    ionViewDidLoad() {
        this.storage.get('last_login_mobile').then((val)=>{
            if(val && val!=''){
                this.userName=val;
            }
        });
    }


    /*    // 读
     test6(){
     // this.fileSer.readErrLogs().then((cc)=>{
     //     console.log(cc);
     // });
     let aa='['+''+this.content.substring(0,this.content.length-1)+']';
     console.log(aa);
     // console.log(JSON.parse(this.content));
     console.log(JSON.parse(aa));
     }
     content:string='';
     // 追写
     test7(){
     // this.fileSer.writeErrLogs('内容');
     // let tem:any=[{function:'login',userName:'18512345678',logLevel:1,message:'登录出错',module:'登录模块',source:'login'},{function:'login',userName:'18512345678',logLevel:1,message:'登录出错',module:'登录模块',source:'login'},];
     // let tem1=JSON.stringify(tem);
     // console.log(tem);
     // console.log(tem1);
     // console.log(JSON.parse(tem1));
     // console.log('**************************');

     let content:any={function:'login',userName:'18512345678',logLevel:1,message:'登录出错',module:'登录模块',source:'login'};
     console.log(content);
     this.content=this.content+''+ JSON.stringify(content)+',';
     console.log(this.content);
     }*/

    presentLoadingText() {

        let _userProtocol = '<div class="protocol-panel"><h4>1：用户须知</h4>' +
            '<p>请您在仔细阅读、充分理解拼单网-客满分用户协议及所附隐私策略（下文简称“本协议”）中各条款，包括免除或限制福州拼单网电子商务有限公司（下文中简称“拼单网”）的免责条款及对拼单网-客满分APP用户（下文简称为“您”）的权利限制条款之后。谨慎选择接受或不接受本协议。本协议是您（自然人/法人名义上的拼单网-客满分使用者）与拼单网之间关于使用拼单网-客满分的相关数据传输协议。您如需要安装、使用拼单网-客满分，则需要您知悉本协议，并接受本协议各项条款的约束。反之、则您须停止安装和使用拼单网-客满分。</p>' +
            '<h4>2：软件说明</h4>' +
            '<p>拼单网-客满分是一套服务于母婴零售行业，立足于客户（会员）关系维护、客户（会员）关系管理及相关自动化数据统计需求所提供的专业化软件系统及整体解决方案。该软件系统由PC管理终端和执行人员手机APP客户端（含Android和IOS两种版本）组成。集成了客户（会员）智能分配、客户（会员）智能化跟踪、执行人员团队管理和管理数据分析等强大的功能，能为母婴零售业主提供信息化、智能化、高效率的客户（会员）关系维护、客户（会员）关系管理及相关自动化数据统计需求的整体解决方案。</p>' +
            '<h4>3：注册说明</h4>' +
            '<p>本拼单网-客满分APP用户账号不可由您自行申请注册，需要先由您的管理员向拼单网申请开通管理员权限账号后，使用该管理员账户登录到PC管理终端，在特定的团队管理功能模块，向拼单网-客满分提供您的移动电话号码和真实姓名后，正式授予您拼单网-客满分APP用户账号权限。</p>' +
            '<h4>4：协议条款</h4>' +
            '<ul>' +
            '<li>（1）在您使用拼单网-客满分的过程中，您知晓并同意接收由拼单网-客满分根据预设的规则的语言模板发送的相关系统通知信息。</li>' +
            '<li>（2）在您使用拼单网-客满分的过程中，您知晓并同意拼单网-客满分根据预设的规则调取和使用您的移动电话的电话簿和语音通话功能。</li>' +
            '</ul>' +
            '<h4>5：隐私策略</h4>' +
            '<ul>' +
            '<li>（1）尊重用户个人隐私是拼单网的一项基本政策。“隐私”是指您在使用拼单网-客满分APP时提供给拼单网的个人身份信息，包括但不限于您的真实姓名、出生日期、身份证件号码（包含但不限于居民身份证号、护照号等）、电子邮件地址、移动或固定电话号码、家庭住址等。</li>' +
            '<li>（2）拼单网一贯积极地采取技术与管理等合理措施保障您的隐私安全，使用商业上合理的安全技术措施来保护您的隐私不在未经授权的情况下被访问、使用或泄漏给第三方个人或组织机构。</li>' +
            '<li>（3）拼单网承诺将善意使用您必要的相关个人信息，不在未获得您的书面授权的情况向任何第三方公开、共享您的任何隐私，也不会强制您对其进行公开或分享。</li>' +
            '</ul>' +
            '<h4>6：免责声明</h4>' +
            '<p>在以下情形之下，拼单网对以上协议内容条款和隐私策略条款的违反，不承担法律或赔偿责任。</p>' +
            '<ul>' +
            '<li>（1）非因拼单网原因，导致您的个人资料被第三方知悉和获取。</li>' +
            '<li>（2）符合国家或地方法律法规所规定的情形，或由国家相关权利机关要求必须对外公布的情形时，对您的个人资料进行对外公布。</li>' +
            '<li>（3）拼单网为了维护自身合法权益而，向用户提起诉讼或者仲裁时，向司法机关提供相关信息。若本协议与国家、地方相关法律法规及行业规范不一致的，以国家、地方相关法律法规及行业规范为准。</li>' +
            '<ul></div>';
        let userProtocol = AppConfig.userProtocol || _userProtocol;
        this.storage.get('UserProtocol').then(
            (val) => {
                if (val && val == 'yes') {
                    this.popser.alertDIY({content: userProtocol, title: '客满分用户协议', okText: '关闭'});
                } else {
                    this.popser.confirmDIY({
                        content: userProtocol,
                        title: '客满分用户协议',
                        escText: '不同意协议',
                        okText: '同意协议'
                    }, () => {
                        this.exit();
                    }, () => {
                        this.storage.set('UserProtocol', 'yes');
                    });
                }
            }
        );
    }

    //退出app
    exit() {
        this.platform.ready().then(() => {
            this.platform.exitApp();
        });
    }

    //去字符串两侧空格
    trim(str) {
        return str.replace(/(^s*)|(s*$)/g, "");
    }

    goLogin() {

        /*
         *  RSA加密
         *  引入security.js
         *
         **/
        // alert(1);
        // var modulus = '5m9m14XH3oqLJ8bNGw9e4rGpXpcktv9MSkHSVFVMjHbfv+SJ5v0ubqQxa5YjLN4vc49z7SVju8s0X4gZ6AzZTn06jzWOgyPRV54Q4I0DCYadWW4Ze3e+BOtwgVU1Og3qHKn8vygoj40J6U85Z/PTJu3hN1m75Zr195ju7g9v4Hk=';
        // var exponent = 'AQAB';
        // var key = RSAUtils.getKeyPair(exponent, '', modulus);
        // var pwd1 = RSAUtils.encryptedString(key, '123456');
        // console.log('pwd1=='+pwd1);
        // alert(2);


        /*
         *  两种JavaScript的AES加密方式
         *  第一种：加解密时需要秘钥（key）和秘钥偏移量（iv）的情况
         *  引入aes_1.js
         *
         **/
        // // var key = CryptoJS.enc.Utf8.parse("十六位十六进制数作为秘钥");
        // var key = CryptoJS.enc.Utf8.parse(")O[NB]6,YF}+efcaj{+oESb9d8>Z'e9M");
        // // var iv  = CryptoJS.enc.Utf8.parse('十六位十六进制数作为秘钥偏移量');
        // var iv  = CryptoJS.enc.Utf8.parse('1234567890123456123');
        // function Encrypt(word){
        //     var srcs = CryptoJS.enc.Utf8.parse(word);
        //     var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
        //     return encrypted.ciphertext.toString().toUpperCase();
        // }
        //
        // function Decrypt(word){
        //     var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        //     var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        //     var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
        //     var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        //     return decryptedStr.toString();
        // }
        // var mm = Encrypt('nihao')
        // console.log(mm);
        // var jm = Decrypt(mm);
        // console.log(jm);


        /*
         *  两种JavaScript的AES加密方式
         *  第二种：加解密时仅需要秘钥
         *  引入aes_2.js
         *
         **/
        // var pwd="秘钥";
        //
        // function Encrypt(word){
        //     return CryptoJS.AES.encrypt(word,pwd).toString();
        // }
        //
        // function Decrypt(word){
        //     return CryptoJS.AES.decrypt(word,pwd).toString(CryptoJS.enc.Utf8);
        // }
        // var mm = Encrypt('nihao');
        // console.log(mm);
        // var jm = Decrypt(mm);
        // console.log(jm);

        var myreg = /^\s*(1\d{10})\s*$/;
        if (!myreg.test(this.trim(this.userName))) {
            this.popser.alert('手机号输入不正确');
            return;
        }
        if(this.password == ''){
            this.popser.alert('密码不能为空');
            return;
        }
        if (this.password.length < 6) {
            this.popser.alert('密码不能小于6位');
          return;
               }
        if(AppConfig.RegExpCn(this.password)){
            this.popser.alert('不能输入中文或表情哦~');
            return;
        }

        //登录 =》 获取配置 =》 获取授权信息


        // this.interface_lists.login({userName: '13489191884', password: '123456'}).then((returnData) => {
        this.interface_lists.login({userName: this.userName, password: this.password}).then((returnData) => {
            if (returnData.isSucceed) {
                AppConfig.userInfo = returnData.data;
                AppConfig.token = returnData.data.token;
                AppConfig.userName = returnData.data.userName;
                // alert('AppConfig.token---'+AppConfig.token);
                // alert('AppConfig.userName---'+AppConfig.userName);
                // alert('AppConfig.userProtocol---'+AppConfig.userProtocol);
                this.storage.set('userInfo', JSON.stringify(returnData.data));
                this.storage.set('last_login_mobile', this.userName);
                /*                this.jPushPlugin.getRegistrationID().then((res)=>{
                 alert(res);
                 },()=>{
                 window.setTimeout(()=>{this.jPushPlugin.getRegistrationID()},1000);
                 }).catch(err => alert(err))*/

                //极光注册
                /* alert(AppConfig.userInfo.uuid.toString());
                 if (window.plugins && window.plugins.jPushPlugin) {
                 window.plugins.jPushPlugin.isPushStopped(function (is) {
                 if (is) {
                 window.plugins.jPushPlugin.resumePush();
                 }
                 window.plugins.jPushPlugin.setAlias(AppConfig.userInfo.uuid.toString());
                 //window.plugins.jPushPlugin.setTags([data.data.employee.orgid.toString(), data.data.employee.orgid + '_' + data.data.employee.storeid]);
                 });
                 }*/

                // 获取用户配置信息-------------------------
                let promise1: any = new Promise((resolve, reject) => {
                    this.interface_lists.getPersonalityConfig().then(
                        (returnData) => {
                            if (returnData.isSucceed && Object.getOwnPropertyNames(returnData.data).length != 0) {
                                AppConfig.callingType = returnData.data.callingType;
                                AppConfig.inited = returnData.data.inited;
                                AppConfig.balanceMinute = returnData.data.balanceMinute;
                                AppConfig.showCustomerPhone = returnData.data.showCustomerPhone;
                                resolve();
                            } else {
                                reject('用户配置信息获取失败,请稍后再试');
                            }
                        }, () => {
                            reject('获取用户配置信息服务器连接失败,请稍后再试');
                        }
                    )
                }).catch(err => console.log(err));

                // 获取授权信息-------------------------
                let promise2: any = new Promise((resolve, reject) => {
                    this.interface_lists.licenses({orgId: AppConfig.userInfo.orgId, productId: 'KMF'}).then(
                        (returnData) => {
                            if (returnData.isSucceed && returnData.data[0]) {
                                AppConfig.expireDate = returnData.data[0].expire;
                                resolve();
                            } else {
                                reject('用户授权信息获取失败,请稍后再试');
                            }
                        }, () => {
                            reject('获取用户授权信息服务器连接失败,请稍后再试');
                        }
                    )
                }).catch(err => console.log(err));

                // 注册有信-------------------------
/*                let account_id = AppConfig.getUserInfo().orgId + "_" + AppConfig.getUserInfo().userId + "_" + AppConfig.getUserInfo().mobile;
                // let account_id = "3_1512_18073118015";
                let promise3: any = new Promise((resolve, reject) => {
                    // alert(123);
                    try {
                        console.log('注册有信');
                        uxin.sdk.signIn(account_id, AppConfig.getUserInfo().mobile, function (msg) {
                            alert(msg);
                            console.log('注册有信ok');
                        }, function (err) {
                            alert(err);
                            console.log('注册有信err');
                        });
                    } catch (e) {
                        alert(e);
                        console.log('注册有信err2');
                        reject(JSON.stringify(e));
                    }
                });*/

                Promise.all([promise1, promise2/*,promise3*/]).then(
                    () => {
                        // this.navCtrl.push(TodayScheduleComponent);
                        this.navCtrl.setRoot(TodayScheduleComponent);
                    }, (err) => {
                        this.popser.alert(err);
                        return;
                    }
                ).catch(err => console.log(err));

            } else {
                switch (returnData.code) {
                    case 100:
                        this.popser.alert('抱歉您的账号未开通，请联系您的管理员');
                        break;
                    case 101:
                        this.popser.alert('用户名或密码输入错误，可以联系您的管理员重置密码');
                        break;
                    case 102:
                        this.popser.alert('禁止登陆');
                        break;
                    case 103:
                        this.popser.alert('数据尚未准备就绪，无法使用系统');
                        break;
                    case 104:
                        this.popser.alert('无效的验证码');
                        break;
                    case 500:
                        this.popser.alert('登录系统内部异常');
                        break;
                    case 405:
                        this.popser.alert('登录请求被拒绝');
                        break;
                    default:
                        this.popser.alert('登录失败，请重试');
                        break;
                }
            }
        }, () => {
            this.popser.alert('登录服务器连接失败，请稍后再试');
            this.networkSer.showNetworkStatus();
        });
    }

    findPassword() {
        this.navCtrl.push(FindPasswordComponent);
    }

}

