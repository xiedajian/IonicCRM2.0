import { Component,ViewChild,Renderer } from '@angular/core';
import { NavController,NavParams,Searchbar } from 'ionic-angular';

import {CustomerDetailsComponent} from '../customer-details/customer-details';
import {Customer} from '../../SharedModule/customer.model';
import {TrackLog} from '../../SharedModule/track-log.model';
import {TrackingListComponent} from '../../TrackingModule/tracking-list/tracking-list';
//import {TabsPage} from '../../tabs/tabs';
import {CustomerService} from '../../SharedModule/customer.service';
import {SearchService} from './search.service';
import {AppConfig} from'../../../app/app.config';

@Component({
    selector: 'page-search-more',
    templateUrl: 'search-more.html',
    providers:[SearchService]
})
export class SearchMoreComponent {

    searchQuery:string = '';
    searchNone:boolean;
    searching:boolean;
    customers:Customer[] = [];
    trackLogs:TrackLog[] = [];
    total:number=0;
    //是否显示结束
    isEnd:boolean;
    query:any={
        orgId:0,
        key:'',
        keyType:0,
        pageIndex:1,
        pageSize:10,
        recordCount:0
    };

    constructor(public navCtrl:NavController,
                public navParams:NavParams,
                public customerService:CustomerService,
                public searchService:SearchService,
                public renderer:Renderer) {
        this.query.keyType = navParams.get('keyType');
        this.searchQuery = navParams.get('searchQuery');
        this.query.key = this.searchQuery;
        this.total = navParams.get('total');
        if (this.query.keyType == 1) {
            this.customers = navParams.get('customers');
            if (this.customers && this.customers.length < this.total) {
                this.isEnd = false;
            }
            else {
                this.isEnd = true;
            }
        }
        else if (this.query.keyType == 2) {
            this.trackLogs = navParams.get('trackLogs');
            if (this.trackLogs && this.trackLogs.length < this.total) {
                this.isEnd = false;
            }
            else {
                this.isEnd = true;
            }
        }
    }


    goSearch(event) {
        //console.log(event.keyCode);
        event.target.value = event.target.value.replace(/[^\a-zA-Z0-9\u4E00-\u9FA5]+$/g, '');
        this.searchQuery = event.target.value;
        if (event.keyCode == 13) {
            if (event.target.value.trim() != '') {
                this.searching = true;
                this.query.key = event.target.value.trim();
                this.query.pageIndex = 1;
                this.query.recordCount = 0;
                this.searchService.getKeySearch(this.query).then(result=> {
                    if(result.isSucceed) {
                        if (this.query.keyType == 1) {
                            this.customers = result.data.customers;
                            this.total = result.data.totalCustomers;
                        }
                        else if (this.query.keyType == 2) {
                            this.trackLogs = result.data.logs;
                            this.total = result.data.totalLogs;
                        }
                        this.searching = false;
                        if (this.total <= 0) {
                            this.searchNone = true;
                        }
                        else {
                            this.searchNone = false;
                        }
                    }
                });
            }
            else {
                this.customers = [];
                this.trackLogs = [];
                this.total = 0;
                this.searchNone = false;
            }
            //搜索后隐藏键盘
            this.renderer.invokeElementMethod(event.target,'blur');
        }
    }

    //加载更多会员信息
    loadMoreList(infiniteScroll) {
        this.query.pageIndex += 1;
        this.query.recordCount = this.total;
        this.searchService.getKeySearch(this.query).then(result=> {
            if (result.isSucceed) {
                console.log(this.query,result);
                if (this.query.keyType == 1) {
                    if (result.data.customers == null || result.data.customers.length <= 0) {
                        this.isEnd = true;
                    }
                    else {
                        if (result.data.customers.length < this.query.pageSize) {
                            this.isEnd = true;
                        }
                        else {
                            this.isEnd = false;
                        }

                        /*for (let i = 0; i < 10; i++) {
                            console.log(i);
                            this.customers.push(result.data.customers[i]);
                        }
                        console.log('a',result.data.customers.length);*/
                        this.customers = this.customers.concat(result.data.customers);
                    }
                    //this.total = result.data.totalCustomers;
                }
                else if (this.query.keyType == 2) {
                    if (result.data.logs == null || result.data.logs.length <= 0) {
                        this.isEnd = true;
                    }
                    else {
                        if (result.data.logs.length < this.query.pageSize) {
                            this.isEnd = true;
                        }
                        else {
                            this.isEnd = false;
                        }
                        /*for (let i = 0; i < result.data.logs.length; i++) {
                            this.trackLogs.push(result.data.logs[i]);
                        }*/
                        this.trackLogs = this.trackLogs.concat(result.logs);
                    }
                    //this.total = result.data.totalLogs;
                }
                /*if (this.total <= 0) {
                    this.searchNone = true;
                }
                else {
                    this.searchNone = false;
                }*/
            }
            infiniteScroll.complete();
        });
    }

    goBack(){
        this.navCtrl.pop();
    }

    onCancel() {
        this.navCtrl.popTo(this.navCtrl.first());//.popTo(TrackingListComponent);
        //console.log(this.navCtrl.getViews(),this.navCtrl.first(),this.navCtrl.length(),this.navCtrl.getByIndex(0));
    }

    gotoCustomerDetails(customer:Customer){
        this.navCtrl.push(CustomerDetailsComponent, {customer: customer})
    }

    gotoCustomerByLog(customerId:number) {
        console.log(customerId);
        this.customerService.getCustomer(customerId).then((result)=> {
            if (result.isSucceed) {
                console.log(result.data);
                if(result.data) {
                    this.gotoCustomerDetails(result.data);
                }
            }
            else {
                let error={
                    function:'gotoCustomerByLog',
                    userName:AppConfig.userName,
                    logLevel:8,
                    message:result.code,
                    module:'TrackingModule',
                    source:'search-more.ts'
                };
                console.log(error);
            }
        },err=>{
            let error={
                function:'gotoCustomerByLog',
                userName:AppConfig.userName,
                logLevel:16,
                message:err.toString(),
                module:'TrackingModule',
                source:'search-more.ts'
            };
            console.log(error);
        });
    }


    ionViewDidLoad() {
        //console.log('Hello SearchPage Page');
    }

    //@ViewChild(Searchbar) searchbar:Searchbar;

    ionViewDidEnter() {
        /*let timeoutId = setTimeout(() => {
            this.searchbar.setFocus();
            clearTimeout(timeoutId);
        }, 0);*/
    }

}
