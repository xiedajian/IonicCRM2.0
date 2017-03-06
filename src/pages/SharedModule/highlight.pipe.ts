import {Pipe,PipeTransform} from '@angular/core';

//内容高亮
@Pipe({name: 'highlightPipe'})
export class HighlightPipe implements PipeTransform {

    /**
     * Highlight a string within a string by adding <span class="highlighted"> around the value
     *
     * Usage:
     *      <span [innerHTML]="word | highlight:letter"></span>
     * Example:
     *      <span [innerHTML]="word | highlight:w"></span>
     *      Formats to: <span><span class="highlighted">w</span>ord</span>
     * @param value
     * @param args
     * @returns {*}
     */
    transform(value, args) {
        //console.log(value, args);
        var query = args.trim();
        if (query && query.length > 0) {
            //console.log(query);
            var regexp = new RegExp('(' + query + ')', 'gi');
            return value.replace(regexp, '<span class="yellow">$1</span>');
        } else {
            return value;
        }
    }

}