import { Directive, Input, HostListener } from '@angular/core';

import { DndHandlerService } from '../../../compositore/dnd-handler.service';

@Directive({
  selector: '[canDrop]'
})
export class CanDropDirective {
  @Input("target") target;

  constructor(
    private dndHandlerService: DndHandlerService
  ) { }

  @HostListener('click') click($event): void {
    this.dndHandlerService.drop(this.target);
    event.stopPropagation();
  }
}
