import { Component,ViewChild,Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams ,Searchbar} from 'ionic-angular';

import {Customer} from '../../SharedModule/customer.model';
import {TrackLog} from '../../SharedModule/track-log.model';
import {CustomerService} from '../../SharedModule/customer.service';
import {SearchService} from './search.service';
import {AppConfig} from'../../../app/app.config';
import {PopSer}     from '../../../providers/pop-ser';
/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers:[SearchService]
})
export class SearchPage {

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public customerService:CustomerService,
              public searchService:SearchService,
              public renderer:Renderer,
              public popser: PopSer) {
    this.query.orgId = AppConfig.userInfo.orgId;
  }


  filter(e){
    this.searchQuery = this.searchQuery.replace(/[^\a-zA-Z0-9\u4E00-\u9FA5]/g, "");
    e.target.value=this.searchQuery;//显示文本替换掉
    // console.log(e)

  }

  goSearch(event) {
    // console.log(event);
    // event.target.value = event.target.value.replace(/[^\a-zA-Z0-9\u4E00-\u9FA5]+$/g, '');
    // this.searchQuery = event.target.value;
    if (event.keyCode == 13) {
      if (event.target.value.trim() != '') {
        this.searching = true;
        this.query.key = event.target.value.trim();
        this.searchService.getKeySearch(this.query).then(result=> {
          // console.log("getKeySearch",result);
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
          else {
            this.searching = false;
            this.searchNone = true;
            this.totalCustomer = 0;
            this.totalTrackLogs = 0;
            switch (result.code) {
              case 600:   //600跳转到系统维护
                this.navCtrl.push('ServiceMaintenancePage');
                break;
              case 400:
                this.popser.alert('请求不合法（请求安全校验没有通过）');
                break;
              case 401:
                this.popser.alert('请求要求身份验证（TOKEN无效）');
                // this.navCtrl.push(LoginComponent);
                this.navCtrl.parent.parent.setRoot('LoginPage');
                break;
              case 500:
                this.popser.alert('系统内部异常');
                break;
              default:
                this.popser.alert('数据获取失败，请重试');
                break;
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
    this.navCtrl.push('CustomerDetailsPage', {customer: customer});
  }

  gotoCustomerByLog(customerId:number) {
    // console.log(customerId);
    this.customerService.getCustomer(this.query.orgId,customerId).then((result)=> {
      if (result.isSucceed) {
        // console.log(result.data);
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
    // console.log(keyType);
    if (keyType == 1) {
      this.navCtrl.push('SearchMorePage', {
        keyType: keyType,
        searchQuery: this.searchQuery,
        customers: this.customers,
        total: this.totalCustomer
      });
    }
    if (keyType == 2) {
      this.navCtrl.push('SearchMorePage', {
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
