import { Directive, Input, ElementRef, HostListener} from '@angular/core';

import { DndHandlerService } from '../../../compositore/dnd-handler.service';

@Directive({
  selector: '[canDrag]'
})
export class CanDragDirective {
  @Input("dragging") dragging: Object;

  constructor(
    elementRef: ElementRef,
    private dndHandlerService: DndHandlerService) { }

  @HostListener('click') click($event) {
    this.dndHandlerService.startDrag(this.dragging);
    event.stopPropagation();
  }
}
