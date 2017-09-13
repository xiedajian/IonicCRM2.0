import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    AfterViewChecked,
    ViewChild,
    ChangeDetectorRef/*, Renderer, ElementRef*/
} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController, ModalController, Content} from 'ionic-angular';
import {CallNumber} from '@ionic-native/call-number';

import {CustomerService} from '../../SharedModule/customer.service'
import {Customer} from '../../SharedModule/customer.model';
import {PopSer} from '../../../providers/pop-ser';
import {CallSer} from '../../../providers/call-ser';

import {TrackResult, CustomerStatus} from "../../SharedModule/enum";
import {InitService} from '../../SharedModule/init.service';
import {DateService} from '../../SharedModule/date.service'
import {AppConfig} from'../../../app/app.config';
import {NetworkSer} from '../../../providers/network-ser';
import {Events} from 'ionic-angular';
/**
 * Generated class for the TrackingListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-tracking-list',
    templateUrl: 'tracking-list.html',
    providers: [InitService]
})
export class TrackingListPage implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

    constructor(public navCtrl: NavController,
                public customerService: CustomerService,
                public popSer: PopSer, public events: Events,
                public actionSheetCtrl: ActionSheetController,
                public modalCtrl: ModalController,
                public initService: InitService,
                public callNumber: CallNumber,
                public changeDetectorRef: ChangeDetectorRef,
                public networkSer: NetworkSer,
                public callSer: CallSer,
                public navParams: NavParams) {
        this.events.subscribe('netError', () => {
            this.deskHead.ForFunction();
        })
    }

    //排序选项是否展开
    sort: boolean = false;
    //排序名称
    sortName: string = "综合排序";
    //当前操作筛选项
    selectFilter: string;
    //品类筛选是否展开
    category: boolean = false;
    //品牌筛选是否展开
    brand: boolean = false;
    //跟踪效果筛选是否展开
    effect: boolean = false;
    //跟踪情况筛选是否展开
    situation: boolean = false;
    //管理方式筛选是否展开
    manage: boolean = false;
    //会员筛选是否展开
    member: boolean = false;
    //购买筛选是否展开
    buy: boolean = false;
    //其它筛选是否展开
    other: boolean = false;

    ionViewDidLoad() {
        console.log('ionViewDidLoad TrackingListPage');
    }

    //获取分配给导购的会员列表请求参数
    filterList = {
        orgId: 0,
        userId: 0,
        dataType: 0,
        lastBuyed: 0,
        lastContact: 0,
        trackStatus: 0,
        dateCalcType: 0,
        isNew: 0,
        isNewAssign: 0,
        customerLevel: 0,
        lastBuyDate: 0,
        maxPCT: 2000,
        minPCT: 0,
        maxBuyCount: 20,
        minBuyCount: 0,
        classNo: '',
        brandType: 1,
        brandNo: '',
        orderBy: 0,
        pageIndex: 1,
        pageSize: 10,
        recordCount: 0,
        top: 0
    };

    //网络是否可用
    //network:boolean = true;
    //定时检测网络句柄
    //networkInt:number;
    //是否显示会员电话号码（导购可见）
    showCustomerPhone: boolean;

    //初始化操作
    ngOnInit() {

        this.customerService.getUnSaveState().then((val) => {
            // console.log('UnSaveState',val);
            if (val && val.userId == AppConfig.userInfo.userId) {
                let obj: any = {
                    //title:'<div class="warm_tip text-center"><img src="assets/img/warm.png" class="img"/></div>',
                    subTitle: `你上次对于会员<span class="yellow">"${val.customer.customerName}"</span>跟踪日志还未填写完成......`,
                    cssClass: "Convex",
                    okText: "继续填写"
                };
                this.popSer.alertDIY(obj, () => {
                    this.navCtrl.push('TrackingPage', {
                        customer: val.customer,
                        contactType: val.contactType,
                        callerPhone: val.callerPhone
                    });
                });
            }
        });
        //获取公司组织Id
        this.filterList.orgId = AppConfig.userInfo.orgId;
        this.filterList.userId = AppConfig.userInfo.userId;
        this.showCustomerPhone = AppConfig.showCustomerPhone;
        this.getCustomers();

        this.initService.setBrands(this.filterList.orgId).then(() => {
            let tBrands = this.initService.getBrands();
            //console.log('tBrands:', tBrands);
            if (tBrands) {
                this.brands = tBrands.brands;
                for (let i = 0; i < this.brands.length; i++) {
                    this.brands[i].isHot = false;
                    for (let j = 0; j < tBrands.hotBrands.length; j++) {
                        if (this.brands[i].brandNo === tBrands.hotBrands[j].brandNo) {
                            this.brands[i].isHot = true;
                            break;
                        }
                    }
                }
                this.setBrandList();
            }
        });
        //console.log("ngOnInit");
        // console.log(this.filterList);
        // console.log(this.time  , this.minBuyCount ,this.maxBuyCount ,this.minPCT, this.maxPCT );
    }


    @ViewChild('mainContent')
    mainContent: Content;
    @ViewChild('brandContent')
    brandContent: Content;

    ngAfterViewInit() {
        // console.log('ngAfterViewInit');
        this.brandContent.ionScrollEnd.subscribe((event) => {
            for (let i = 0; i < this.pyList.length - 1; i++) {
                //console.log(event.scrollTop,this.pyList[i].top,this.pyList[i].letter);
                if (event.scrollTop < this.pyList[i].top) {
                    this.selectLetter = this.pyList[i - 1].letter;
                    //console.log(this.selectLetter);
                    break;
                }
            }
            //console.log(event.scrollTop,event.scrollElement.offsetHeight,event.scrollElement.scrollHeight,event);
            /*if (event.scrollTop + event.scrollElement.offsetHeight >= event.scrollElement.scrollHeight) {
             this.isScrollBottom = true;
             }
             else {
             this.isScrollBottom = false;
             }*/
            this.changeDetectorRef.detectChanges();
        });
    }


    ngAfterViewChecked() {
        //console.log('ngAfterViewChecked', this.selectFilter, this.brand, this.isGetLetterTop);
        if (this.selectFilter === 'brand' && this.brand && !this.isGetLetterTop) {
            for (let i = 0; i < this.pyList.length; i++) {
                if (i == 0) {
                    this.pyList[i].top = document.getElementById('hotBrand').offsetTop;
                    continue;
                }
                if (i == 1) {
                    this.pyList[i].top = document.getElementById('hotBrand').offsetHeight + document.getElementById(this.pyList[i].letter).offsetHeight;
                }
                else {
                    this.pyList[i].top = document.getElementById(this.pyList[i].letter).offsetTop + document.getElementById(this.pyList[i].letter).offsetHeight;
                }
            }
            this.isGetLetterTop = true;
            //console.log(this.pyList);
        }
    }

    //获取品牌的高度
    brandHeight() {
        let height = document.getElementById("hotBrand");
        return document.body.clientHeight - ( this.getElementTop(height) + 41 );
    }


    ngOnDestroy() {
        // console.log("ngOnDestroy");
    }

    //更新会员信息
    getCustomers(type: string = "") {
        if (!this.networkSer.isConnected) {
            this.customerService.isLoad = true;
            this.popSer.alert("网络不可用，请稍后再试~");
            return;
        }
        else {
            this.filterList.pageIndex = 1;
            this.filterList.recordCount = 0;
            this.customerService.isLoad = false;
            this.popSer.loadOn(this.customerService.isLoad);
            this.customerService.getCustomers(this.filterList, null, type);
        }
    }

    //刷新列表
    refreshList(refresher) {
        if (!this.networkSer.isConnected) {
            this.customerService.isLoad = true;
            this.popSer.loadOn(this.customerService.isLoad);
            // this.popSer.loadOn(true);
            refresher.complete();
            return;
        }
        else {
            this.filterList.pageIndex = 1;
            this.filterList.recordCount = 0;
            this.customerService.getCustomers(this.filterList, refresher);
        }
        // this.popSer.loadOn(this.customerService.isLoad);
        // console.log(1);
    }

    pull() {
        //console.log("ionPull");
    };

    start() {
        //console.log("start");
    };

    //加载更多会员信息
    loadMoreList(infiniteScroll) {
        if (!this.networkSer.isConnected) {
            infiniteScroll.complete();
            return;
        }
        this.filterList.pageIndex += 1;
        this.filterList.recordCount = this.customerService.total;
        this.customerService.getCustomers(this.filterList, infiniteScroll);
        //alert(this.filterList.pageIndex);
    }

    //检查网络状态
    /*checkNetwork() {
     this.networkInt = setInterval(() => {
     console.log("checkNetwork");
     this.network = false;
     }, 3000);
     }*/

    //排序操作
    onSort(value: number) {
        if (this.filterList.orderBy != value) {
            this.filterList.orderBy = value;
            switch (value) {
                case 0:
                    this.sortName = "综合排序";
                    break;
                case 1:
                    this.sortName = "最近跟踪时间";//由近及远
                    break;
                case -1:
                    this.sortName = "最近跟踪时间";//由远及近
                    break;
                case 2:
                    this.sortName = "最近购买时间";//由近及远
                    break;
                case -2:
                    this.sortName = "最近购买时间";//由远及近
                    break;
                case 3:
                    this.sortName = "总消费额";//从高到低
                    break;
                case -3:
                    this.sortName = "总消费额";//从低到高
                    break;
            }
            //条件变改
            this.getCustomers("sort");
        }
        this.sort = !this.sort;
        this.hideTabsBar(this.sort);
    }

    //品类列表
    classNoList = [
        {
            name: '全部',
            value: ''
        },
        {
            name: '奶粉',
            value: '100000'
        },
        {
            name: '纸尿裤',
            value: '200000'
        },
        {
            name: '其它',
            value: '990000'
        }
    ];
    //当前选中的品类编码
    selectClassNo: string = '';

    //品类筛选操作
    setClassNo(classNo: string) {
        if (this.selectClassNo != classNo) {
            this.selectClassNo = classNo;
            this.filterList.classNo = classNo;
            //条件变改
            this.getCustomers();
        }
        this.category = !this.category;
        this.hideTabsBar(this.category);
    }

    //品牌列表
    brands: any[];
    //所有品牌列表（包括字母）
    allBrandList: any[] = [];
    //拼音字母列表
    pyList: any[] = [];
    //当前选中的字母，默认为热销品牌
    selectLetter: string = '热销品牌';
    //是否获取过字母位置
    isGetLetterTop: boolean = false;
    //是否已经滚动到底部
    isScrollBottom: boolean = false;
    //品牌过滤方式
    selectBrandType: number = 1;


    //品牌筛选操作
    setBrandList() {
        this.brands.sort((param1, param2) => param1.py.localeCompare(param2.py));
        this.pyList.push(({letter: '热销品牌', top: 0}));
        for (let i = 0; i < this.brands.length; i++) {
            if (this.brands[i].py !== '') {
                if (i == 0 || this.brands[i].py[0] !== this.brands[i - 1].py[0]) {
                    this.allBrandList.push({
                        name: this.brands[i].py[0].toUpperCase(),
                        brandNo: '',
                        isHot: false,
                        type: 'letter',
                        checked: false
                    });
                    this.pyList.push({letter: this.brands[i].py[0].toUpperCase(), top: 0});
                }
                this.allBrandList.push({
                    name: this.brands[i].brandName,
                    brandNo: this.brands[i].brandNo,
                    isHot: this.brands[i].isHot,
                    type: 'name',
                    checked: false
                });
            }
        }
        //console.log(this.brands);
        //console.log(this.allBrandList);
    }

    //选中字母操作
    goLetter(letter: string, index: number) {
        //console.log(letter, index);
        let top = this.pyList[index + 1].top;
        /*let dimensions = this.brandContent.getContentDimensions();
         //console.log(top, dimensions);
         if (top >= dimensions.scrollHeight - dimensions.contentHeight && this.isScrollBottom) {
         return;
         }*/
        //console.log(top, this.brandContent.getContentDimensions());
        this.brandContent.scrollTo(0, top, 0);
        /*if (letter == '*') {
         letter = '热销品牌';
         }
         this.selectLetter = letter;*/
    }

    //清空品牌筛选
    clearBrand() {
        if (this.filterList.brandNo != '') {
            this.filterList.brandNo = '';
            this.filterList.brandType = 1;
            this.getCustomers();
        }
        this.brand = !this.brand;
        this.hideTabsBar(this.brand);
    }

    //确定品牌筛选
    doBrand() {
        let oldBrandNo = this.filterList.brandNo;
        this.filterList.brandNo = "";
        for (let i = 0; i < this.allBrandList.length; i++) {
            //console.log(this.allBrandList[i].checked, this.filterList.brandNo.indexOf(this.allBrandList[i].brandNo), this.allBrandList[i].brandNo);
            if (this.allBrandList[i].type == 'name' && this.allBrandList[i].checked && this.filterList.brandNo.indexOf(this.allBrandList[i].brandNo) < 0) {
                this.filterList.brandNo += this.allBrandList[i].brandNo + ',';
            }
        }
        this.filterList.brandNo = this.filterList.brandNo.substr(0, this.filterList.brandNo.length - 1);
        this.brand = !this.brand;
        if (oldBrandNo !== this.filterList.brandNo) {
            this.getCustomers();
            this.hideTabsBar(this.brand);
            return;
        }
        if (this.selectBrandType !== this.filterList.brandType) {
            this.filterList.brandType = this.selectBrandType;
            if (this.filterList.brandNo) {
                this.getCustomers();
            }
            this.hideTabsBar(this.brand);
            return;
        }
        this.hideTabsBar(this.brand);
    }

    //是否隐藏Tabs标签
    hideTabsBar(value: boolean) {
        let tabs = document.querySelectorAll('.tabbar');
        console.log(tabs);
        if (tabs !== null) {
            Object.keys(tabs).map((key) => {
                tabs[key].style.display = value ? 'none' : 'flex';
                // tabs[key].style.transform = value ? 'translateY(56px)' : 'translateY(0)';
            });
        }
    }

    //跟踪效果筛选操作
    setEffect(value: number) {
        if (this.filterList.lastBuyed != value) {
            this.filterList.lastBuyed = value;
            this.getCustomers();
        }
        this.effect = !this.effect;
        this.hideTabsBar(this.effect);
    }

    //跟踪情况筛选操作
    setSituation(lastContact: number, trackStatus: number) {
        if (this.filterList.lastContact != lastContact || this.filterList.trackStatus != trackStatus) {
            this.filterList.lastContact = lastContact;
            this.filterList.trackStatus = trackStatus;
            this.getCustomers();
        }
        this.situation = !this.situation;
        this.hideTabsBar(this.situation);
    }

    //管理方式筛选操作
    setManage(value: number) {
        if (this.filterList.dateCalcType != value) {
            this.filterList.dateCalcType = value;
            this.getCustomers();
        }
        this.manage = !this.manage;
        this.hideTabsBar(this.manage);
    }

    //是否新加入会员
    isNew: number = 0;
    //是否新分配会员
    isNewAssign: number = 0;
    //会员等级
    customerLevel: number = 0;
    //设置新加入会员
    setNew(value: number) {
        this.isNew = value;
    }

    //设置新分配会员
    setNewAssign(value: number) {
        this.isNewAssign = value;
    }

    //设置会员等级
    setCustomerLevel(value: number) {
        this.customerLevel = value;
    }

    //清空会员筛选
    clearMember() {
        if (this.filterList.isNew != 0 || this.filterList.isNewAssign != 0 || this.filterList.customerLevel != 0) {
            this.filterList.isNew = 0;
            this.filterList.isNewAssign = 0;
            this.filterList.customerLevel = 0;
            this.getCustomers();
        }
        this.member = !this.member;
        this.hideTabsBar(this.member);
    }

    //确定会员筛选
    doMember() {
        if (this.filterList.isNew != this.isNew || this.filterList.isNewAssign != this.isNewAssign || this.filterList.customerLevel != this.customerLevel) {
            this.filterList.isNew = this.isNew;
            this.filterList.isNewAssign = this.isNewAssign;
            this.filterList.customerLevel = this.customerLevel;
            this.getCustomers();
        }
        this.member = !this.member;
        this.hideTabsBar(this.member);
    }

    //@ViewChild('myTime') myTime: ElementRef;
    //最后消费时间范围提示
    setTimeTip(value: number) {
        //this.renderer.setElementStyle(this.myTime,'color', 'primary');
        switch (value) {
            case 0:
                this.timeTip = "不限";
                break;
            case 1:
                this.timeTip = "昨天";
                break;
            case 2:
                this.timeTip = "近7天";
                break;
            case 3:
                this.timeTip = "本月";
                break;
            case 4:
                this.timeTip = "近3个月";
                break;
            case 5:
                this.timeTip = "近6个月";
                break;
            case 6:
                this.timeTip = "近12个月";
                break;
            default:
                this.timeTip = "";
                break;
        }
        setTimeout((timeTip) => {//一定要这么传参，才能有值
            timeTip = this.timeTip;
            document.getElementById("rangeTime").getElementsByClassName("range-pin")[0].innerHTML = timeTip;
        }, 5);
    }


    //获取最后消费时间
    getLastBuyDate(value: number): number {
        switch (value) {
            case 0:
                return 0;
            case 1:
                return 1;
            case 2:
                return 7;
            case 3:
                return new Date().getDate() - 1;
            case 4:
                return 90;
            case 5:
                return 180;
            case 6:
                return 365;
            default:
                return 0;
        }
    }


    //时间范围提示
    timeTip: string = "不限";
    //时间范围值
    time: number = 0;
    //filterList中的time值
    lastBuyDate: number = 0;
    //购买次数
    buyCount: any;
    //平均客单价
    PCT: any;
    //当前最小购买次数
    minBuyCount: number = 0;
    //当前最大购买次数
    maxBuyCount: number = 20;
    //当前最小客单价
    minPCT: number = 0;
    //当前最大客单价
    maxPCT: number = 2000;
    //设置购买次数范围
    setBuyCount(buyCount: any) {
        this.minBuyCount = buyCount.lower;
        this.maxBuyCount = buyCount.upper;
    }

    //设置平均客单价范围
    setPCT(PCT: any) {
        this.minPCT = PCT.lower;
        this.maxPCT = PCT.upper;
    }

    //清空购买筛选
    clearBuy() {
        if (this.filterList.lastBuyDate != 0 || this.filterList.minBuyCount != 1 || this.filterList.maxBuyCount != 20 || this.filterList.minPCT != 1 || this.filterList.maxPCT != 2000) {
            this.filterList.lastBuyDate = 0;
            this.lastBuyDate = 0;
            this.filterList.minBuyCount = 0;
            this.filterList.maxBuyCount = 20;
            this.filterList.minPCT = 0;
            this.filterList.maxPCT = 2000;
            this.getCustomers();
        }
        this.buy = !this.buy;
        this.hideTabsBar(this.buy);
    }

    //确定购买筛选
    doBuy() {
        let tLastBuyDate = this.getLastBuyDate(this.time);
        //console.log(tLastBuyDate);
        if (this.filterList.lastBuyDate != tLastBuyDate || this.filterList.minBuyCount != this.buyCount.lower || this.filterList.maxBuyCount != this.buyCount.upper || this.filterList.minPCT != this.PCT.lower || this.filterList.maxPCT != this.PCT.upper) {
            this.filterList.lastBuyDate = tLastBuyDate;
            this.lastBuyDate = this.time;
            this.filterList.minBuyCount = this.buyCount.lower;
            this.filterList.maxBuyCount = this.buyCount.upper;
            this.filterList.minPCT = this.PCT.lower;
            this.filterList.maxPCT = this.PCT.upper;
            this.getCustomers();
        }
        this.buy = !this.buy;
        this.hideTabsBar(this.buy);
    }

    deskHead: any = {//其他选项高度的变化
        height: 0,//由于other选项出来而导致的高度变化
        fixedContent: 0,
        scrollContent: 0,
        deskSelect: 0,
        deskOtherSelect: 0,
        ForFunction: () => {
            setTimeout(() => {//延迟几秒可以等html反应，这样获取的高度才准确
                this.deskHead.height = document.getElementsByClassName("deskHead")[0].clientHeight;
                this.deskHead.fixedContent = document.getElementsByTagName("page-tracking-list")[0].getElementsByClassName(" fixed-content");
                this.deskHead.scrollContent = document.getElementsByTagName("page-tracking-list")[0].getElementsByClassName("scroll-content");
                for (var i = 1; i < this.deskHead.fixedContent.length; i++)//因为品牌选项里也有content,且是第一个数组，所以i从1开始
                {
                    this.deskHead.fixedContent[i].style.marginTop = this.deskHead.height + 'px';
                    this.deskHead.scrollContent[i].style.marginTop = this.deskHead.height + 'px';
                }
            });

        }/*,
         selectFunction:(name)=>{//综合排序，品类等弹窗位置
         setTimeout(()=>{
         this.deskHead.height= document.getElementsByClassName("deskHead")[0].clientHeight;
         if( name){
         this.deskHead.deskOtherSelect=document.getElementsByClassName("other_p_select");
         for(var i=0;i<this.deskHead.deskOtherSelect.length;i++)
         {
         this.deskHead.deskOtherSelect[i].style.top=this.deskHead.height+'px';
         }
         }
         else{
         this.deskHead.deskSelect=document.getElementsByClassName(" desk_select");
         for(var i=0;i<this.deskHead.deskSelect.length;i++)
         {
         this.deskHead.deskSelect[i].style.top=this.deskHead.height+'px';
         }
         }

         },3);
         }*/
    };

    //点击筛选项操作
    onSelectFilter(name: string) {
        if (this.selectFilter === 'other' || name == 'other' || this.selectFilter == 'effect' || this.selectFilter == 'situation' || this.selectFilter == 'manage' || this.selectFilter == 'member' || this.selectFilter == 'buy') {
            this.deskHead.ForFunction();
        }
        switch (name) {
            case "sort":
                if (this.selectFilter == name) {
                    this.sort = !this.sort;
                }
                else {
                    this.selectFilter = name;
                    this.sort = true;
                    this.category = false;
                    this.brand = false;
                    this.other = false;
                }
                break;
            case "category":
                if (this.selectFilter == name) {
                    this.category = !this.category;
                }
                else {
                    this.selectFilter = name;
                    this.sort = false;
                    this.category = true;
                    this.brand = false;
                    this.other = false;
                }
                break;
            case "brand":
                if (this.selectFilter == name) {
                    this.brand = !this.brand;
                }
                else {
                    this.selectFilter = name;
                    this.sort = false;
                    this.category = false;
                    this.brand = true;
                    this.other = false;
                }
                if (this.brand) {
                    this.selectBrandType = this.filterList.brandType;
                    for (let i = 0; i < this.allBrandList.length; i++) {
                        this.allBrandList[i].checked = false;
                    }
                    // console.log(this.allBrandList);
                    if (this.filterList.brandNo !== '') {
                        let brandsNo = this.filterList.brandNo.split(',');
                        for (let i = 0; i < brandsNo.length; i++) {
                            for (let j = 0; j < this.allBrandList.length; j++) {
                                if (brandsNo[i] === this.allBrandList[j].brandNo) {
                                    this.allBrandList[j].checked = true;
                                    break;
                                }
                            }
                        }
                    }
                    //console.log(this.brandContent.scrollTop);
                    //this.brandContent.scrollTo(0,0,0);
                }
                break;
            case "other":
                if (this.selectFilter == name) {
                    this.other = !this.other;
                }
                else {
                    this.selectFilter = name;
                    this.sort = false;
                    this.category = false;
                    this.brand = false;
                    this.other = !this.other;
                    this.effect = false;
                    this.situation = false;
                    this.manage = false;
                    this.member = false;
                    this.buy = false;
                }
                break;
            case "effect":
                if (this.selectFilter == name) {
                    this.effect = !this.effect;
                }
                else {
                    this.selectFilter = name;
                    this.effect = true;
                    this.situation = false;
                    this.manage = false;
                    this.member = false;
                    this.buy = false;
                    // console.log(this.other);
                }
                break;
            case "situation":
                if (this.selectFilter == name) {
                    this.situation = !this.situation;
                }
                else {
                    this.selectFilter = name;
                    this.effect = false;
                    this.situation = true;
                    this.manage = false;
                    this.member = false;
                    this.buy = false;
                }
                break;
            case "manage":
                if (this.selectFilter == name) {
                    this.manage = !this.manage;
                }
                else {
                    this.selectFilter = name;
                    this.effect = false;
                    this.situation = false;
                    this.manage = true;
                    this.member = false;
                    this.buy = false;
                }
                break;
            case "member":
                if (this.selectFilter == name) {
                    this.member = !this.member;
                }
                else {
                    this.selectFilter = name;
                    this.effect = false;
                    this.situation = false;
                    this.manage = false;
                    this.member = true;
                    this.buy = false;
                }
                if (this.member) {
                    this.isNew = this.filterList.isNew;
                    this.isNewAssign = this.filterList.isNewAssign;
                    this.customerLevel = this.filterList.customerLevel;
                }
                break;
            case "buy":
                if (this.selectFilter == name) {
                    this.buy = !this.buy;
                }
                else {
                    this.selectFilter = name;
                    this.effect = false;
                    this.situation = false;
                    this.manage = false;
                    this.member = false;
                    this.buy = true;
                }
                if (this.buy) {
                    this.time = this.lastBuyDate;
                    this.buyCount = {lower: this.filterList.minBuyCount, upper: this.filterList.maxBuyCount};
                    this.PCT = {lower: this.filterList.minPCT, upper: this.filterList.maxPCT};
                    this.setTimeTip(this.time);
                    this.setBuyCount(this.buyCount);
                    this.setPCT(this.PCT);
                }
                break;
        }
        this.hideTabsBar(this.sort || this.category || this.brand || this.other && (this.situation || this.effect || this.manage || this.member || this.buy));

        // if(this.sort || this.category || this.brand || this.other){
        //     this.deskHead.selectFunction( this.other);
        // }


    }


    //切换会员列表类型
    switchTrackList(type: number) {
        if (this.filterList.dataType != type) {
            //折叠筛选项
            this.sort = false;
            this.category = false;
            this.brand = false;
            this.other = false;
            this.effect = false;
            this.situation = false;
            this.manage = false;
            this.member = false;
            this.buy = false;
            //this.deskHead.ForFunction();
            if (this.selectFilter === 'other' || this.selectFilter == 'effect' || this.selectFilter == 'situation' || this.selectFilter == 'manage' || this.selectFilter == 'member' || this.selectFilter == 'buy') {
                this.deskHead.ForFunction();
            }

            this.filterList.dataType = type;
            this.filterList.top = this.mainContent.scrollTop;
            this.customerService.setFilter(this.customerService.filters[type == 1 ? 0 : 1], this.filterList);
            if (!this.customerService.isSameFilter(this.customerService.filters[type], this.filterList)) {
                //获取最新
                this.mainContent.scrollToTop();
                this.getCustomers();
                if (!this.networkSer.isConnected) {
                    this.customerService.customers = type == 0 ? this.customerService.todayCustomers : this.customerService.allCustomers;
                    this.customerService.total = this.customerService.filters[type].total;
                    // console.log(this.customerService.customers);
                }
                //console.log('获取最新');
            }
            else {
                this.filterList.pageIndex = this.customerService.filters[type].pageIndex;
                this.customerService.customers = type == 0 ? this.customerService.todayCustomers : this.customerService.allCustomers;
                this.mainContent.scrollTo(0, this.customerService.filters[type].top, 0);
                this.customerService.isEnd = this.customerService.filters[type].isEnd;
                this.customerService.total = this.customerService.filters[type].total;
            }
            this.hideTabsBar(false);
        }
    }


    /*用Pipe代替
     //返回会员等级文本提示
     getCustomerLevelText(level:number) {
     switch (level) {
     case 1:
     return "需优先跟踪";
     case 2:
     return "维持日常跟踪";
     case 3:
     return "可选择性跟踪";
     case 4:
     return "不建议跟踪";
     }
     }
     //返回会员等级样式
     getCustomerLevelClass(level:number):string {
     switch (level) {
     case 1:
     return "small_red_btn";
     case 2:
     return "small_orange_btn";
     case 3:
     return "small_yellow_btn";
     case 4:
     return "small_grey_btn";
     }
     }
     */

    //返回跟踪结果文本提示
    getLastTrackResultText(customer: Customer) {
        let resultText: string;
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
                resultText = "待评估";
                break;
            default:
                resultText = "未购买";
                break;
        }
        //console.log(customer.lastTrackDate,new Date(customer.lastTrackDate),new Date());
        let date = DateService.getDateDiff(customer.lastTrackDate);
        return (date == 0 ? "今日" : date + '天前') + "跟踪过，跟踪后" + resultText;
    }

    //返回下次跟踪提示
    getNextTrackText(customer: Customer) {
        if (customer.status == CustomerStatus.Track) {
            let date = DateService.getDateDiff(customer.nextTrackDate);
            return date > 0 ? "计划 " + DateService.getFormatDate(customer.nextTrackDate) + " 跟踪，已超期" + date + "天" : "";
        }
    }


    //转到会员详情页
    gotoCustomerDetails(customer: Customer) {
        this.navCtrl.push('CustomerDetailsPage', {customer: customer});
        //this.navCtrl.push(AccountDetailsComponent);
    }

    //转到搜索页
    search() {
        if (!this.networkSer.isConnected) {
            return;
        }
        //this.navCtrl.push(SearchComponent);
        let modal = this.modalCtrl.create('SearchPage');
        /*modal.onDidDismiss(data => {
         console.log(data);
         });*/
        modal.present();
    }

    //拨打电话
    call(customer: Customer) {
        event.stopPropagation();
        if (!customer.contactMobile) {
            this.popSer.alert(`<span class="yellow">"${customer.customerName}"</span>电话还未录入收银系统中......<wr/>请联系管理员，将他的电话录入到收银系统中，以便及时跟踪。`, () => {
            }, true);
            return;
        }
        let callData: any = {
            tel: customer.contactMobile,
            title: '<div class="warm_tip text-center"><img src="assets/img/warm.png" class="img"/></div>',
            subTitle: `即将拨打"${customer.customerName}"电话... `,
            content: '<span class="yellow">请在与会员沟通时注意保持礼节</span>',
            okText: "继续呼叫"
        };
        // 设置取消按钮的文字
        setTimeout(() => {//延迟几秒可以等html反应，这样获取的高度才准确
            let trackText = document.getElementsByClassName("btn_track")[0].getElementsByClassName("button-inner")[0];
            trackText.innerHTML = "已跟踪<small>(使用其他方式跟踪过了，直接填写跟踪日志)</small>";
        }, 3);
        let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'call_pop',
            buttons: [
                {
                    text: '普通电话',
                    cssClass: 'btn_normal',
                    handler: () => {
                        if (AppConfig.callingType == 1) {
                            this.popSer.alert(`<div class="text-center">普通通话服务不可用</br>请联系管理员开通普通通话服务</div>`);
                            return;
                        }
                        if (AppConfig.platform == 'android') {
                            /*******************普通通话临时补救方式******************/
                            this.popSer.callPop(callData, () => {
                            }, () => {
                                this.customerService.setUnSaveState(1, customer, AppConfig.userInfo.mobile);
                                this.navCtrl.push('TrackingPage', {
                                    customer: customer,
                                    contactType: 1,
                                    callerPhone: AppConfig.userInfo.mobile
                                });
                            });
                            /*********************END****************/
                        } else {
                            /*******************原来的方案******************/
                            this.popSer.confirmDIY(callData, () => {
                            }, () => {
                                this.callNumber.callNumber(customer.contactMobile, true).then(() => {
                                    /*                            //获取随机测试账号
                                     let cc=AppConfig.getTestCount();
                                     CallNumber.callNumber(cc.number, true).then(()=> {*/
                                    // console.log('success');
                                    this.customerService.setUnSaveState(1, customer, AppConfig.userInfo.mobile);
                                    this.navCtrl.push('TrackingPage', {
                                        customer: customer,
                                        contactType: 1,
                                        callerPhone: AppConfig.userInfo.mobile
                                    });
                                }, (error) => {
                                    console.log('a: ' + error || 'error');
                                }).catch((error) => {
                                    console.log('b:' + error || 'error');
                                });
                            });
                            /*********************END****************/
                        }
                    }
                },
                {
                    text: '免费电话',
                    cssClass: 'btn_free',
                    role: 'destructive',
                    handler: () => {
                        if (AppConfig.callingType == 2) {
                            this.popSer.alert(`<div class="text-center">免费通话服务不可用</br>请联系管理员开通免费通话服务</div>`);
                            return;
                        }
                        this.callSer.uxinRemainMinute().then(() => {
                            // console.log('success');
                            this.callSer.uxinBindCall(customer).then(() => {
                                // console.log('填日志');
                                // this.callSer.UxinCallUnbind();//解绑
                                this.customerService.setUnSaveState(2, customer, AppConfig.userInfo.mobile);
                                this.navCtrl.push('TrackingPage', {
                                    customer: customer,
                                    contactType: 2,
                                    callerPhone: AppConfig.userInfo.mobile
                                });
                            }, (error) => {
                                console.log('a: ' + error || 'error');
                            }).catch((error) => {
                                console.log('b:' + error || 'error');
                            });
                        }, (error) => {
                            console.log('a: ' + error || 'error');
                            this.popSer.alert(error);
                        }).catch((error) => {
                            console.log('b:' + error || 'error');
                        });
                    }
                },
                {
                    // text: '已跟踪<small>(使用其他方式跟踪过了，直接填写跟踪日志)</small>',
                    // text:x,
                    cssClass: 'btn_track',
                    handler: () => {
                        this.navCtrl.push('TrackingPage', {
                            customer: customer,
                            contactType: 0
                        });
                        // console.log('已跟踪');
                    }
                },
                {
                    text: '取消',
                    cssClass: 'btn_cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    handler: () => {
                        // console.log('取消 clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    goToSearch() {
        this.navCtrl.push('SearchPage');
    }


    getElementTop(element) {
        let actualTop = element.offsetTop;
        let current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }


    ionViewDidEnter() {
        //this.checkNetwork();
        //console.log('ionViewDidEnter');
    }

    ionViewWillLeave() {
        //clearInterval(this.networkInt);
        //console.log('ionViewWillLeave');
    }

    ngOnChanges(changeRecord) {
        console.log(1)
    }

    test() {
        this.customerService.testUxin();

        /*let d1=new Date();
         let d2=new Date("2017-03-15 19:30:00");
         let s="2017-03-16T19:30:33.397";
         let d3=new Date(s);
         console.log(DateService.getFormatNow(),new Date(DateService.getFormatNow()).getTime());
         console.log(DateService.getFormatDate(s),new Date(DateService.getFormatDate(s)).getTime());

         console.log(d3.getUTCFullYear() + '年' + (d3.getUTCMonth() + 1) + '月' + d3.getUTCDate() + '日');
         console.log(d3.getFullYear() + "年" + (d3.getMonth() + 1) + "月" + (d3.getDate()) + "日");
         console.log(d3.toISOString(),'/',d3.toUTCString(),d3.getUTCDate());
         console.log(d2.toLocaleString(),'/',d2.toLocaleDateString(),'/',d2.toString(),'/',d2.toDateString());
         console.log(d3.toLocaleString(),'/',d3.toLocaleDateString(),'/',d3.toString(),'/',d3.toDateString());
         console.log((new Date(d1.toLocaleDateString()).getTime() - new Date(d2.toLocaleDateString()).getTime()) / 1000 / 60 / 60 / 24);
         */
    }

}
