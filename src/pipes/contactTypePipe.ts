import { Pipe, PipeTransform} from '@angular/core';

//跟踪方式数字转换
@Pipe({
    name: 'contactTypePipe'
})
export class ContactTypePipe implements PipeTransform {
    transform(contactType:any, ...args):any {
        let contactTypeText:string='';
      switch(contactType){
          case 1 : contactTypeText="普通通话";break;
          case 2 : contactTypeText="免费通话";break;
          case 3 : contactTypeText="上门拜访";break;
          case 4 : contactTypeText="QQ";break;
          case 5 : contactTypeText="微信";break;
          case 6 : contactTypeText="SMS短信";break;
          case 10 : contactTypeText="其它沟通渠道";break;
          default:break;
      }
        return contactTypeText;
    }

}