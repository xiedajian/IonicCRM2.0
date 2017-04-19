import {Injectable, Pipe, PipeTransform} from '@angular/core';


//日期字符串只取10位
@Pipe({
    name: 'dataSubstringPipe'
})
@Injectable()
export class DataSubstringPipe implements PipeTransform {
    transform(data:any):any {
        let res:string='';
        if(data && data!=''){
            res=data.substring(0,10);
        }
        return res;
    }

}