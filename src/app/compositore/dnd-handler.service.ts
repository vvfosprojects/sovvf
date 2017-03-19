import { Injectable, ElementRef, Renderer } from '@angular/core';

import { DndInfo } from './dnd-info';
import { CompositoreService } from './compositore.service';

/**
 * GUI level service which centralizes drag action information
 */
@Injectable()
export class DndHandlerService {
  private dndDraggingInfo: DndInfo = null;
  private dndDroppingInfo: DndInfo[] = [];

  constructor(private compositoreService: CompositoreService) { }

  /**
   * Starts a drag action
   * @param renderer The renderer associated to dragging component
   * @param el The component element reference
   * @param dragging The object being dragged
   */
  public startDrag(renderer: Renderer, el: ElementRef, dragging: any): boolean {
    if (this.ongoingDrag())
      this.cancelDrag();

    this.dndDraggingInfo = new DndInfo(dragging, el, renderer);
    this.highlightOngoingDrag();

    console.log("Start drag", this.dndDraggingInfo.element, this.dndDraggingInfo.model);

    return true;
  }

  /**
   * Cancels an ongoing drag action
   */
  public cancelDrag(): void {
    if (this.ongoingDrag()) {
      this.deactivateOngoingDrag();
      this.dndDraggingInfo = null;
      this.dndDroppingInfo.forEach((info) => {
        info.renderer.setElementClass(info.element.nativeElement, 'dropping', false);
      })
      this.dndDroppingInfo = [];
      console.log("Cancel drag");
    }
  }

  /**
   * Handles election of a drop candidate
   * @param renderer The renderer associated to component it is going to drop over
   * @param el The reference of the element it is going to drop over
   * @param target The object it is going to drop over
   */
  public handleDropCandidate(renderer: Renderer, el: ElementRef, target: any) {
    if (!this.ongoingDrag()) {
      console.log("No ongoing drag");
      return;
    }

    if (this.dndDraggingInfo.model.askIfYouCanBeDroppedOn(target)) {
      console.log("Yes: can be dropped");

      //deactivates possibly highlighted dropping component
      if (this.dndDroppingInfo.length > 0) {
        let oldDropping = this.dndDroppingInfo[0];
        oldDropping.renderer.setElementClass(oldDropping.element.nativeElement, 'dropping', false);
      }

      //highlights new dropping component
      let newDropping = new DndInfo(target, el, renderer);
      this.dndDroppingInfo.unshift(newDropping);
      renderer.setElementClass(el.nativeElement, 'dropping', true);
    } else 
      console.log("No: cannot be dropped", this.dndDraggingInfo.model, target);
  }

  /**
   * Handles cancelation of dropping candidate
   * @param renderer The renderer associated to canceled component 
   * @param el The reference to canceled component
   * @param target The canceled instance
   */
  public handleDroppingCandidateCancelation(renderer: Renderer, el: ElementRef, target: any) {
    renderer.setElementClass(el.nativeElement, 'dropping', false);

    //pops each element in the stack different from target
    while (this.dndDroppingInfo.length > 0 && this.dndDroppingInfo[0].model !== target)
      this.dndDroppingInfo.splice(0, 1);
    //pops target
    if (this.dndDroppingInfo.length > 0)
      this.dndDroppingInfo.splice(0, 1);
  }

  /**
   * Completes a drag action
   * @param target The target of drag
   */
  public drop(target: any): void {
    if (this.ongoingDrag()) {
      this.dndDraggingInfo.model.dropOn(target);
      console.log("Drag completed:", this.dndDraggingInfo.model, target);
      this.cancelDrag();
    }
  }

  /**
   * Indicates whether a drag action is in execution
   */
  private ongoingDrag(): boolean {
    return (!!this.dndDraggingInfo);
  }

  /**
   * Highlights the current dragging element
   */
  private highlightOngoingDrag(): void {
    this.dndDraggingInfo.renderer.setElementClass(this.dndDraggingInfo.element.nativeElement, 'dragging', true);
  }

  /**
   * Deactivates the current dragging highlight
   */
  private deactivateOngoingDrag(): void {
    this.dndDraggingInfo.renderer.setElementClass(this.dndDraggingInfo.element.nativeElement, 'dragging', false);
  }
}
