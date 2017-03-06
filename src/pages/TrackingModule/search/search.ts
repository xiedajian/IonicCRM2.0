import { Component,ViewChild,Renderer } from '@angular/core';
import { NavController,Searchbar } from 'ionic-angular';

import {CustomerDetailsComponent} from '../customer-details/customer-details';
import {SearchMoreComponent} from './search-more';
import {Customer} from '../../SharedModule/customer.model';
import {TrackLog} from '../../SharedModule/track-log.model';
import {CustomerService} from '../../SharedModule/customer.service';
import {SearchService} from './search.service';
import {AppConfig} from'../../../app/app.config';

@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
    providers:[CustomerService,SearchService]
})
export class SearchComponent {

    searchQuery:string = '';
    searchNone:boolean;
    searching:boolean;
    customers:Customer[] = [];
    totalCustomer:number = 0;
    trackLogs:TrackLog[] = [];
    totalTrackLogs:number = 0;
    query:any={
        orgId:0,
        key:'',
        keyType:0,
        pageIndex:1,
        pageSize:10,
        recordCount:0
    };

    constructor(public navCtrl:NavController,
                public customerService:CustomerService,
                public searchService:SearchService,
                public renderer:Renderer) {
    }


    goSearch(event) {
        //console.log(event);
        event.target.value = event.target.value.replace(/[^\a-zA-Z0-9\u4E00-\u9FA5]+$/g, '');
        this.searchQuery = event.target.value;
        if (event.keyCode == 13) {
            if (event.target.value.trim() != '') {
                this.searching = true;
                this.query.key = event.target.value.trim();
                this.searchService.getKeySearch(this.query).then(result=> {
                    if (result.isSucceed) {
                        this.customers = result.data.customers;
                        this.totalCustomer = result.data.totalCustomers;
                        this.trackLogs = result.data.logs;
                        this.totalTrackLogs = result.data.totalLogs;
                        this.searching = false;
                        if (this.totalCustomer <= 0 && this.totalTrackLogs <= 0) {
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
                this.totalCustomer = 0;
                this.trackLogs = [];
                this.totalTrackLogs = 0;
                this.searchNone = false;
                //console.log('aa', this.customers.length);
            }
            //搜索后隐藏键盘
            this.renderer.invokeElementMethod(event.target, 'blur');
        }
    }

    onCancel() {
        this.navCtrl.pop();
    }

    gotoCustomerDetails(customer:Customer) {
        this.navCtrl.push(CustomerDetailsComponent, {customer: customer});
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
                    source:'search.ts'
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
                source:'search.ts'
            };
            console.log(error);
        });
    }


    //keyType:1，会员  2，日志  0，全部
    goSearchMore(keyType:number) {
        console.log(keyType);
        if (keyType == 1) {
            this.navCtrl.push(SearchMoreComponent, {
                keyType: keyType,
                searchQuery: this.searchQuery,
                customers: this.customers,
                total: this.totalCustomer
            });
        }
        if (keyType == 2) {
            this.navCtrl.push(SearchMoreComponent, {
                keyType: keyType,
                searchQuery: this.searchQuery,
                trackLogs: this.trackLogs,
                total: this.totalTrackLogs
            });
        }
    }

    @ViewChild(Searchbar) searchbar:Searchbar;
    ionViewDidLoad() {

    }

    ionViewDidEnter() {
        let timeoutId = setTimeout(() => {
            this.searchbar.setFocus();
            //this.renderer.invokeElementMethod(this.searchbar,'focus');
            clearTimeout(timeoutId);
        }, 0);
    }

}
