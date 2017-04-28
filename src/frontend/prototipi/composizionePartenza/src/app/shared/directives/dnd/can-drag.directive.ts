import { Directive, Input, ElementRef, HostListener, Renderer} from '@angular/core';

import { DndHandlerService } from '../../../compositore/dnd-handler.service';

@Directive({
  selector: '[canDrag]'
})
export class CanDragDirective {
  @Input("dragging") dragging: any;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer,
    private dndHandlerService: DndHandlerService) { }

  @HostListener('click') click($event) {
    this.dndHandlerService.startDrag(this.renderer, this.elementRef, this.dragging);
    event.stopPropagation();
  }
}
