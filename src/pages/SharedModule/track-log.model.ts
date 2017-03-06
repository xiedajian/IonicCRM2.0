import {ContactType,TrackResult,TrackDateCalcType,NotContactReason} from './enum';

//日志信息
export class TrackLog{
    logId:number;
    userId:number;
    employeeName:string;
    customerId:number;
    customerName:string;
    trackResult:TrackResult;
    trackDetails:TrackDetails;
    /*contactType:ContactType;
    voicRecordSize:number;
    voiceRecordUrl:string;
    trackDate:any;
    trackDateCalcType:TrackDateCalcType;
    remark:string;*/
    version:number;
    orders:Order[];
}

class TrackDetails{
    content:string;
    contactType:ContactType;
    voicRecordSize:number;
    voiceRecordUrl:string;
    trackDate:any;
    notContactReason:NotContactReason;
    nextAction:number;
    nextTrackDate:any;
}

class Order{
    consumeDate:any;
    saleAmount:any;
    orderNo:string;
    googs:Googs[];
}

class Googs{
    goodsNo:string;
    goodsName:string;
    quantity:number;
    saleAmount:any;
}