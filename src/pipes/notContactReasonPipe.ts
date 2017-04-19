import {Injectable, Pipe, PipeTransform} from '@angular/core';


//未接通原因 数字转换
@Pipe({
    name: 'notContactReasonPipe'
})
@Injectable()
export class notContactReasonPipe implements PipeTransform {
    //未接通原因 数字转换
    transform(notContactReasonType:any):any {
        let notContactReasonText:string='';
      switch(notContactReasonType){
          case 1 : notContactReasonText="空号";break;
          case 2 : notContactReasonText="电话号码错误";break;
          case 3 : notContactReasonText="停机";break;
          case 4 : notContactReasonText="无人接听";break;
          case 5 : notContactReasonText="占线";break;
          case 6 : notContactReasonText="其他";break;
          default:break;
      }
        return notContactReasonText;
    }

}