import { Pipe, PipeTransform } from '@angular/core';

//返回会员等级文本提示
@Pipe({name:'customerLevelTextPipe',pure: false})
export class CustomerLevelTextPipe implements PipeTransform{
    transform(customerLevel:number):string{
        //console.log(customerLevel);
        switch (customerLevel) {
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
}

//返回会员等级样式
@Pipe({name:'customerLevelClassPipe',pure: false})
export class CustomerLevelClassPipe implements PipeTransform{
    transform(customerLevel:number):string{
        switch (customerLevel) {
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
}