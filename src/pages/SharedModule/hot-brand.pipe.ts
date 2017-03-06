import { Pipe, PipeTransform } from '@angular/core';


//过滤热销品牌
@Pipe({name:'hotBrandPipe',pure: false})
export class HotBrandPipe implements PipeTransform {
    transform(value:any[]) {
        return value.filter(brand=>brand.isHot);
    }
}
