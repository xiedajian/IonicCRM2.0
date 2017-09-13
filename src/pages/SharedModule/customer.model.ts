import {CustomerLevel,TrackDateCalcType,CustomerStatus,TrackResult} from './enum';

//会员信息
export class Customer{
    customerId:number;
    customerName:string;
    isNew:boolean;
    isNewAssign:boolean;
    contactMobile:string;
    customerLevel:CustomerLevel;
    lastTrackDate:any;
    nextTrackDate:any;
    trackDateCalcType:TrackDateCalcType;
    status:CustomerStatus;
    trackResult:TrackResult;
    lastTrackLog:string;
    evaluateStatus:boolean;//评估状态
}