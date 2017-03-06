import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
    constructor() {
    }

    //返回当前日期跟指定日期时间差（天）
    static getDateDiff(date:any):number {
        if (date == undefined || date == null || date == "") {
            return 0;
        }
        let nowDate:any = new Date();
        return (new Date(nowDate.toLocaleDateString()).getTime() - new Date(date.toLocaleDateString()).getTime()) / 1000 / 60 / 60 / 24
    }

    //获取格式化日期
    static getFormatDate(date:any) {
        //let date = new Date(d);
        //let seperator = "-";
        let month:any = date.getMonth() + 1;
        let strDate:any = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getFullYear() + '-' + month + '-' + strDate;
    }
}