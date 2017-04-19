import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'numtotimePipe'
})
@Injectable()
export class NumToTimePipe implements PipeTransform {
    /*
     数字转分钟
     70  => 01:10"
     */
    transform(second:number):any {
        var mm:number = Math.floor(second / 60);
        var ss:number = Math.ceil(second % 60);
        let minute:string = mm < 10 ? ('0' + mm.toString()) : mm.toString();
        let seconds:string = ss < 10 ? ('0' + ss.toString()) : ss.toString();
        let r:string = minute + ":" + seconds + '"';
        return r;
    }

}
