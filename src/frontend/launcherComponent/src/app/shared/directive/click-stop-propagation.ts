import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appClickStopPropagation]'
})
export class ClickStopPropagationDirective {
    @HostListener('click', [ '$event' ])
    onClick(event: any): void {
        event.stopPropagation();
    }
}
