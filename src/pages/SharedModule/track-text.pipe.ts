import { Pipe, PipeTransform } from '@angular/core';

import {Customer} from '../SharedModule/customer.model';
import {TrackResult,CustomerStatus,TrackDateCalcType} from "../SharedModule/enum";
import {DateService} from '../SharedModule/date.service';


//返回跟踪状态文本提示
@Pipe({name:'trackStatusTextPipe',pure: false})
export class TrackStatusTextPipe implements PipeTransform {
    transform(customer:Customer) {
        if (customer.status == CustomerStatus.UnTrack) {
            return "不可跟踪";
        }
        if (customer.status == CustomerStatus.Track) {
            let date = DateService.getDateDiff(customer.nextTrackDate);
            if (date < 0) {
                if (customer.trackResult == TrackResult.Assess) {
                    return "下次跟踪时间：待定";
                }
                else {
                    return "下次跟踪时间：" + DateService.getFormatDate(customer.nextTrackDate) + "，" + (0 - date) + "天后需跟踪";
                }
            }
            if (date == 0) {
                return "今日待跟踪";
            }
            if (date > 0) {
                if (DateService.getDateDiff(customer.lastTrackDate) == 0) {
                    return DateService.getFormatDate(customer.nextTrackDate) + " 需跟踪,今日已跟踪";
                }
                return DateService.getFormatDate(customer.nextTrackDate) + " 需跟踪,已超期" + date + "天";
            }
        }
    }
}


//返回跟踪结果文本提示
@Pipe({name:'trackResultTextPipe',pure: false})
export class TrackResultTextPipe implements PipeTransform{
    transform(customer:Customer){
        let resultText:string;
        if (customer.trackResult == TrackResult.UnTrack) {
            return "尚未跟踪过";
        }
        switch (customer.trackResult) {
            case TrackResult.UnContact:
                resultText = "未联系上";
                break;
            case TrackResult.Purchase:
                resultText = "已购买";
                break;
            case TrackResult.Assess:
                resultText = "评估中";
                break;
            default:
                resultText = "未购买";
                break;
        }
        let date = DateService.getDateDiff(customer.lastTrackDate);
        return (date > 0 ? date + '天前跟踪过，' : '') + "跟踪后" + resultText;
    }
}


//返回跟踪日期计算方式文本提示
@Pipe({name:'trackDateCalcTypePipe',pure: false})
export class TrackDateCalcTypePipe implements PipeTransform {
    transform(trackDateCalcType:number):string {
        switch (trackDateCalcType) {
            case TrackDateCalcType.System:
                return "系统智能管理跟踪时间";
            case TrackDateCalcType.Manual:
                return "人工管理";
            default:
                return "";
        }
    }
}

//返回会员状态文本提示
@Pipe({name:'customerStatusTextPipe',pure: false})
export class CustomerStatusTextPipe implements PipeTransform {
    transform(customerStatus:number):string {
        switch (customerStatus) {
            case CustomerStatus.Track:
                return "可跟踪";
            case CustomerStatus.UnTrack:
                return "不可跟踪";
            default:
                return "";
        }
    }
}

