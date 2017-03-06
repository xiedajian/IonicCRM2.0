import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Storage} from '@ionic/storage';
import {AES_key, AppConfig}from'../app/app.config';
import {PopSer}from'./pop-ser';
import {LoginComponent}from'../pages/LoginModule/login/login';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

declare function SHA1(msg:string);
/*SHA1散列*/
declare function hex_md5(msg:string);
/*MD5加密*/
declare var CryptoJS;
/*AES加密*/
declare var RSAUtils;
/*RSA加密*/

/**
 * HTTP请求服务
 */
@Injectable()
export class HttpSer {

    constructor(public http:Http, public popser:PopSer) {
    }

    /**
     * get方式请求
     * @param   url：string　 paramObj:{name:'大见',age:'23'}
     * @returns Promise
     */
    get(url:string, paramObj:any = {}) {
        let timestamp = this.getTimestamp();
        let sign = this.getSign(paramObj, timestamp);
        let headers = this.getHeader(sign, timestamp);
        let options = new RequestOptions({headers: headers});
        return this.http.get(url + this.toQueryString(paramObj), options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * post方式请求
     * @param   url：string　 paramObj:{name:'大见',age:'23'}
     * @returns Promise
     */
    post(url:string, body:any = {}) {
        let timestamp = this.getTimestamp();
        let sign = this.getSign(body, timestamp);
        let headers = this.getHeader(sign, timestamp);
        let options = new RequestOptions({headers: headers});
        return this.http.post(url, this.toBodyString(body), options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * 登陆App
     * 密码的算法：SHA1（SHA1(密码明文)+请求头中的timestamp）
     * 密码的算法：MD5（MD5(密码明文)+请求头中的timestamp）
     * @param   url：string　 body:{userName:'大见',password:'123456'}
     * @returns Promise
     */
    login(url:string, body:any = {}) {
        let timestamp = this.getTimestamp();
        //对密码加密处理
        // let password=SHA1(SHA1(body.password)+timestamp);
        let password = hex_md5(hex_md5(body.password) + timestamp);
        let newbody = {
            userName: body.userName,
            password: password,
        }
        console.log(url);
        console.log(newbody);
        let sign = this.getSign(newbody, timestamp);
        let headers = this.getHeader(sign, timestamp);
        let options = new RequestOptions({headers: headers});
        return this.http.post(url, this.toBodyString(newbody), options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * 修改密码 || 重置密码
     * @param   url：string　 body:{userName:'大见',password:'123456',newPassword:'654321'} ||  body:{userName:'大见',newPassword：'654321'}
     * @returns Promise
     * 密码的算法：SHA1（SHA1(密码明文)+请求头中的timestamp）
     * 新密码算法：AES（MD5（密码明文））
     * 注：body两个元素为重置密码，三个元素为修改密码
     */
    setNewPassword(url:string, body:any = {}) {
        let timestamp = this.getTimestamp();
        let newbody:any={};
        let vi = this.getVi(timestamp);
        let newPassword = this.AES_Encrypt(hex_md5(body.newPassword), vi);
        var arr = Object.keys(body);
        console.log(body);
        console.log(arr);
        // console.log(body.length);
        console.log(arr.length);
        if(arr.length==2){
            newbody = {
                userName: body.userName,
                newPassword: newPassword,
            }
            console.log('重置密码');
        }else {
            let password = hex_md5(hex_md5(body.password) +''+ timestamp);
            newbody = {
                userName: body.userName,
                password: password,
                newPassword: newPassword,
            }
            console.log('修改密码');
        }
        console.log(vi);
        console.log(url);
        console.log(newbody);
        let sign = this.getSign(newbody, timestamp);
        let headers = this.getHeader(sign, timestamp);
        let options = new RequestOptions({headers: headers});
        return this.http.post(url, this.toBodyString(newbody), options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    /**
     * 获取当前时间 减 2015年1月1日的 时间戳
     */
    private getTimestamp() {
        let timestamp = (new Date().getTime()-1420070400).toString().substr(0, 10);
        return timestamp;
    }

    /**
     * 制作请求头header
     * @param   sign  timestamp
     * @returns headers
     */
    private getHeader(sign:string, timestamp:string) {
        let headers:any = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('token', AppConfig.getToken());
        headers.append('timestamp', timestamp);
        headers.append('platform', AppConfig.getPlatform());
        headers.append('deviceid', AppConfig.getDeviceid());
        headers.append('sign', sign);
        headers.append('appName', AppConfig.getAppName());
        headers.append('appVersion', AppConfig.getAppVersion());
        return headers;
    }

    /**
     *  制作签名
     * @param  obj (请求参数),timestamp
     * @return {string}
     *  1.取出所有参数及值（公共及所有的业务参数），按小写字母序由小到大排列得到A1；
     *  2.将A1 + timestamp拼接为一个字符串，得到A2
     *  3.用SHA1算法对A2做散列得到A3
     *  4.将A3 + userName再拼接成一个字符串，得到A4
     *  5.用SHA1算法对A4做散列得到签名值：sign
     */
    private getSign(obj:any = {}, timestamp:string) {
        let ret:any[] = [];
        for (let key in obj) {
            let values = obj[key];
            if (values && values.constructor == Array) {//数组
                let queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toSignPair(key, value));
                }
                ret = ret.concat(queryValues);
            } else { //字符串
                ret.push(this.toSignPair(key, values));
            }
        }
        ret.push(this.toSignPair('token', AppConfig.getToken()));
        ret.push(this.toSignPair('platform', AppConfig.getPlatform()));
        ret.push(this.toSignPair('deviceid', AppConfig.getDeviceid()));
        ret.push(this.toSignPair('appName', AppConfig.getAppName()));
        ret.push(this.toSignPair('appVersion', AppConfig.getAppVersion()));
        ret.sort();
        // let A1:string = ret.join('&');
        // let A2 = A1 + '' + timestamp;
        // let A3 = SHA1(A2);
        // let A4 = A3 + AppConfig.getuserName();
        // let sign = SHA1(A4);
        let A1:string = ret.join('&');
        let A2 = A1 + '' + timestamp;
        let A3 = hex_md5(A2);
        let A4 = A3 + AppConfig.getuserName();
        let sign = hex_md5(A4);
        // console.log('token' + '--' + AppConfig.getToken());
        console.log(ret);
        // console.log('A1' + '--' + A1);
        // console.log('A2' + '--' + A2);
        // console.log('A3' + '--' + A3);
        // console.log('A4' + '--' + A4);
        // console.log('A5' + '--' + sign);
        return sign;
    }

    /**
     * get请求参数处理
     * @param obj　参数对象
     * @return {string}　参数字符串
     * @example
     *  声明: var obj= {'name':'大见',age:23};
     *  调用: toQueryString(obj);
     *  返回: "?name=%E5%B0%8F%E5%86%9B&age=23"
     */
    private toQueryString(obj) {
        let ret = [];
        for (let key in obj) {
            key = encodeURIComponent(key);
            let values = obj[key];
            if (values && values.constructor == Array) {//数组
                let queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            } else { //字符串
                ret.push(this.toQueryPair(key, values));
            }
        }
        return '?' + ret.join('&');
    }

    /**
     *  post请求参数处理
     * @param obj
     * @return {string}
     *  声明: var obj= {'name':'大见',age:23};
     *  调用: toQueryString(obj);
     *  返回: "name=%E5%B0%8F%E5%86%9B&age=23"
     */
    private toBodyString(obj) {
        let ret = [];
        for (let key in obj) {
            key = encodeURIComponent(key);
            // key = key;
            let values = obj[key];
            if (values && values.constructor == Array) {//数组
                let queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            } else { //字符串
                ret.push(this.toQueryPair(key, values));
            }
        }
        return ret.join('&');
    }

    private toQueryPair(key, value) {
        if (typeof value == 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
        // return key + '=' +(value === null ? '' : String(value));
    }

    private toSignPair(key, value) {
        return key + '=' + (value === null ? '' : String(value));
    }

    private extractData(res:Response) {
        let body = res.json();
        // return body.data || {};
        // if(!body.IsSucceed){
        //    this.popser.alert(body.code.toString()+body.msg);
        //     if(body.code==401){
        //         this.popser.alert('长时间没有登录或者在其他设备登录',()=>{
        //             // this.navCtrl.push(LoginComponent);
        //         });
        //     }
        // }
        return body || {};
    }

    private handleError(error:Response | any) {
        let errMsg:string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    }


    /**
     * AES加密
     * @param   word：string(需要加密的字符)　 iv:string（秘钥偏移量）
     * @returns String
     * 注：需要秘钥（AES_key）和秘钥偏移量（iv）
     */
    public AES_Encrypt(word, iv) {
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, AES_key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString().toUpperCase();
    }

    /**
     * AES解密
     * @param   word：string(需要解密的字符)　 iv:string（秘钥偏移量）
     * @returns String
     * 注：需要秘钥（AES_key）和秘钥偏移量（iv）
     */
    public AES_Decrypt(word, iv) {
        var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        var decrypt = CryptoJS.AES.decrypt(srcs, AES_key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }

    //制作秘钥偏移量（iv）
    /**
     * 制作AES秘钥偏移量（iv）
     * @param   timestamp：string(时间戳)　
     * @returns String
     * 注：iv=timestamp+年月日
     */
    public  getVi(timestamp) {
        let date = new Date();
        let month:any = date.getMonth() + 1;
        let strDate:any = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let iv:string = timestamp + "" + date.getFullYear() + "" + month + "" + strDate;
        return iv;
    }
}
