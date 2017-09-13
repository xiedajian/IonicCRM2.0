import { Injectable } from '@angular/core';

//import {Customer} from '../../SharedModule/customer.model';
import {AppConfig} from'../../../app/app.config';
//import {TrackResult,CustomerStatus} from "../../SharedModule/enum";
import {CRMService} from '../../SharedModule/crm.service';
import {DateService} from '../../SharedModule/date.service';
//import {CUSTOMERS} from '../../SharedModule/customer.service';
import {LOGS} from '../../SharedModule/track-log.service';



@Injectable()
export class SearchService {

    constructor(public crmService:CRMService) {
    }

    //
    getKeySearch(query:any) {
        query.orgId = AppConfig.userInfo.orgId;
        return this.crmService.getKeySearch(query);
        //模拟数据
        //return this.getKeySearchSlow(query);
    }


    //模拟数据
    /*getKeySearchSlow(param:any):Promise<any> {
        return new Promise<any>(resolve=>
            setTimeout(resolve, 500))
            .then(()=>{
                let result = {
                    isSucceed: true,
                    data: {
                        customers: CUSTOMERS,
                        totalCustomers: CUSTOMERS.length,
                        logs: LOGS,
                        totalLogs: LOGS.length
                    }
                };
                return Promise.resolve(result);
            });
    }*/


    getFormatDate(date:any) {
        return DateService.getFormatDate(date);
    }


}
