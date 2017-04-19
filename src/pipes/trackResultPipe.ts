import {Injectable, Pipe, PipeTransform} from '@angular/core';


//跟踪结果数字转换--trackResult
@Pipe({
    name: 'trackResultPipe'
})
@Injectable()
export class TrackResultPipe implements PipeTransform {
    //跟踪结果数字转换
    transform(trackResult:any):any {
        let trackResultText:string='';
      switch(trackResult){
          case 0 : trackResultText="未跟踪";break;
          case 1 : trackResultText="未联系上";break;
          case 2 : trackResultText="待评估";break;
          case 3 : trackResultText="已购买";break;
          case 4 : trackResultText="未购买";break;
          default:break;
      }
        return trackResultText;
    }

}