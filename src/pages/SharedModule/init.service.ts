import { Injectable } from '@angular/core';

import {Brands} from "./crm.model";
import {CRMService} from './crm.service'
import {AppConfig} from'../../app/app.config';
import {CustomerService} from './customer.service';

const BRANDS:Brands= {
    brands: [
        {
            brandNo: '1001',
            brandName: '美赞臣',
            py: 'MZC'
        },
        {
            brandNo: '1002',
            brandName: '多美滋',
            py: 'DMZ'
        },
        {
            brandNo: '1003',
            brandName: '惠氏',
            py: 'HS'
        },
        {
            brandNo: '1004',
            brandName: '雅培',
            py: 'YP'
        },
        {
            brandNo: '1005',
            brandName: '圣元',
            py: 'SY'
        },
        {
            brandNo: '1006',
            brandName: '美素',
            py: 'MS'
        },
        {
            brandNo: '1007',
            brandName: '伊威',
            py: 'YW'
        },
        {
            brandNo: '1008',
            brandName: '通货玩具',
            py: 'THWJ'
        },
        {
            brandNo: '1009',
            brandName: '伊利',
            py: 'YL'
        },
        {
            brandNo: '1010',
            brandName: '星尚',
            py: 'XS'
        },
        {
            brandNo: '1011',
            brandName: '太子乐',
            py: 'TZL'
        },
        {
            brandNo: '1012',
            brandName: '咔哇熊',
            py: 'KWX'
        },
        {
            brandNo: '1013',
            brandName: '雅士利',
            py: 'YSL'
        }
    ],
    hotBrands: [
        {
            brandNo: '1001',
            brandName: '美赞臣',
            py: 'MZC'
        },
        {
            brandNo: '1003',
            brandName: '惠氏',
            py: 'HS'
        },
        {
            brandNo: '1004',
            brandName: '雅培',
            py: 'YP'
        },
        {
            brandNo: '1012',
            brandName: '咔哇熊',
            py: 'KWX'
        },
        {
            brandNo: '1013',
            brandName: '雅士利',
            py: 'YSL'
        }
    ]
};

@Injectable()
export class InitService {
    private brands:Brands;

    constructor(public crmService:CRMService,public customerService:CustomerService) {

    }

    //从服务端获取品牌信息
    setBrands(orgId:number) {
        return this.crmService.getBrands(orgId).then((result)=> {
        //return this.setBrandsSlow(orgId).then((result)=> {
        //     console.log(result);
            if (result.isSucceed) {
                this.brands = result.data;
            }
            else {
                let error = {
                    function: 'setBrands',
                    userName: AppConfig.userName,
                    logLevel: 8,
                    code: result.code,
                    message: result.msg,
                    module: 'SharedModule',
                    source: 'init.service.ts'
                };
                this.customerService.writeError(error);
            }
        }, err=> {
            let error = {
                function: 'setBrands',
                userName: AppConfig.userName,
                logLevel: 16,
                code: 0,
                message: err.toString(),
                module: 'SharedModule',
                source: 'init.service.ts'
            };
            this.customerService.writeError(error);
        });
    }


    //模拟数据
    setBrandsSlow(orgId:number):Promise<any> {
        return new Promise<any>(resolve=>
            setTimeout(resolve, 1000))
            .then(()=>{
                let result = {
                    isSucceed: true,
                    data: BRANDS
                };
                return Promise.resolve(result);
            });
    }

    //获取品牌信息
    getBrands():Brands {
        return this.brands;
    }
}