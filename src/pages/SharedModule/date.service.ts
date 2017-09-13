import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
    constructor() {
    }

    //返回当前日期跟指定日期时间差（天）
    static getDateDiff(d:string):number {
        if (!d) {
            return 0;
        }
        //let nowDate:any = new Date();
        //let date = new Date(d.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''));
        return (new Date(this.getFormatNow()).getTime() - new Date(this.getFormatDate(d)).getTime()) / 1000 / 60 / 60 / 24
    }

    //获取格式化日期
    static getFormatDate(d:string) {
        //let date = new Date(d.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''));
        let date = new Date(d);
        let month:any = date.getUTCMonth() + 1;
        let strDate:any = date.getUTCDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getUTCFullYear() + '-' + month + '-' + strDate;
    }

    //获取格式化日期
    static getFormatNow() {
        let date = new Date();
        let month:any = date.getUTCMonth() + 1;
        let strDate:any = date.getUTCDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getUTCFullYear() + '-' + month + '-' + strDate;
    }
}