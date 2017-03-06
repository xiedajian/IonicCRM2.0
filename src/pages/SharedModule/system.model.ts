import {LicenseType} from './enum';

//App版本检测信息,如果hasNewVersion为false，则其它字段返回是当前版本的信息
export class AppVersion{
    //是否有新版本
    hasNewVersion:boolean;
    //新的App版本号
    version:number;
    versionCode:string;
    //升级App地址
    upgradeUrl:string;
    //发行版内容提示
    releaseTipes:string;
}

//配置信息
export class Config{
    //配置的通话方式,默认0：即普通通话和免费通话
    callType:number;
    //系统是否可用,指该执行人员归属的数据是否准备完毕
    inited:boolean;
    //剩余通话分钟数
    balanceMinute:number;
}

//公告信息
export class Notice{
    //公告标题
    title:string;
    //小标题
    subTitle:string;
    //内容类型,0：文字 1：图片
    contentType:number;
    //文字内容/图片地址
    content:string;
    /*
    0：第一次启动
    1：每次启动
    2：每天首次启动
    */
    showOccasion:number;
    //显示顺序
    seqIndex:number;
}

//产品授权信息
export class Licenses{
    //产品Id
    productId:string;
    //产品代码
    productCode:string;
    //产品名称
    productName:string;
    //许可生效日期
    effect:string;
    //许可失效日期
    expire:string;
    //发行版内容提示
    numbers:string;
    //许可证类型
    licenseType:LicenseType;
}

//用户信息
export class User{
    //用户Id
    userId:number;
    //全局用户Id
    uuid:number;
    //用户组织机构Id
    orgId:number;
    //用户名称
    name:string;
    //执行人员的联系方式
    mobile:string;
}