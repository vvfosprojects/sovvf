import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appMousePosition]'
})
export class MosuePositionDirective {

    @HostListener('mousemove', ['$event'])
    onMouseMove(event): void {
        console.log(event.clientX, event.clientY);
    }
}
