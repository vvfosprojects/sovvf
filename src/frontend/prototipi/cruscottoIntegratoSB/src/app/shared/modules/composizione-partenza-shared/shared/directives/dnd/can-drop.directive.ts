import {
  Directive,
  Input,
  HostListener,
  Renderer,
  ElementRef
} from '@angular/core';

import { DndHandlerService } from '../../../compositore/dnd-handler.service';

@Directive({
  selector: '[canDrop]'
})
export class CanDropDirective {
  @Input('target') target;

  constructor(
    private renderer: Renderer,
    private el: ElementRef,
    private dndHandlerService: DndHandlerService
  ) {
  }

  private implementsDndTarget(instance: any): boolean {
    return ('canAccept' in instance) &&
      ('accept' in instance);
  }

  @HostListener('click') click($event): void {
    this.dndHandlerService.drop(this.target);
    event.stopPropagation();
  }

  @HostListener('mouseenter') enter($event) {
    this.dndHandlerService.handleDropCandidate(this.renderer, this.el, this.target);
    event.stopPropagation();
  }

  @HostListener('mouseleave') leave($event) {
    this.dndHandlerService.handleDroppingCandidateCancelation(this.renderer, this.el, this.target);
    event.stopPropagation();
  }
}
