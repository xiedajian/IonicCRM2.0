import {TrackResult} from './enum'

//工作台信息
export class WorkSpace {
    //今日需跟踪人数
    todayTracks:number;
    //明天可能需要跟踪人数
    tomorrowTracks:number;
}

//导购跟踪效率
export class TrackingOverview{
    //跟踪完成率
    completionRate:any;
    //跟踪后产生的销售额
    saleAmount:any;
    //购买人数
    totalBuyer:number;
    //跟踪成功率（累计）
    trackSuccedRate:any;
    //跟踪日志数量
    totalTracklog:number
}

//品牌信息
export class Brands{
    //所有品牌列表
    brands:Brand[];
    //热销品牌列表
    hotBrands:Brand[];
}
class Brand {
    //品牌编码
    brandNo:string;
    //品牌名称
    brandName:string;
    //拼音首字母
    py:string;
}

//会员画像
export class Portrait{
    //会员喜欢的品牌
    likeBrandName:string;
    //会员喜欢的品类
    likeClassname:string;
    //总消费金额
    totalPurchaseAmount:any;
    //总购买次数
    totalPurchaseTimes:number;
    //客单价
    PCT:any;
    //最近消费时间
    lastPurchaseDate:any;
    //距上次消费天数
    notConsumeDays:number;
    //最近消费金额
    lastConsumeAmount:any;
    //最近购买商品件数
    lastConsumeQty:number;
}

//会员消费结构
export class ConsumeStructure {
    //总消费结构数据
    overallStruct:ConsumeStruct[];
    //上次消费结构数据
    lastStruct:ConsumeStruct[];
    //购买频次
    buyFrequency:Frequency[];
    //跟踪效果结构
    resultStruct:ResultStruct[];
}
//消费结构
class ConsumeStruct{
    //品类编号
    classNo:string;
    //品类名称
    className:string;
    //品类总销售金额
    totalAmount:any;
}
//购买频次
class Frequency{
    //月份,201612
    month:number;
    //购买的总次数
    times:number;
}
//跟踪效果结构
class ResultStruct {
    //跟踪效果状态值
    code:TrackResult;
    //状态名
    name:string;
    //次数
    times:number;
}

//操作日志
export class OperatLog{
    //标识
    id:number;
    //操作日期
    operateDate:any;
    //操作者账号Id
    operateUuid:number;
    //操作者名称
    operateName:string;
    //操作日志内容
    remark:string;
}