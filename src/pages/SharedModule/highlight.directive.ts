import { Directive, ElementRef, Input, Renderer } from '@angular/core';


@Directive({ selector: '[myHighlight]' })
export class HighlightDirective {
    constructor(el: ElementRef, renderer: Renderer) {
        //console.log(el,el.nativeElement.outerText);
        renderer.setElementStyle(el.nativeElement, 'color', '#F39800');
    }
}
