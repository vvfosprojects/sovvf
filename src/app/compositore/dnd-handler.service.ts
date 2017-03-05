import { Injectable } from '@angular/core';

import { CompositoreService } from './compositore.service';

@Injectable()
export class DndHandlerService {
  private dragging = null;
  constructor(private compositoreService: CompositoreService) { }

  /**
   * Starts a drag action
   * @param dragging The object being dragged
   */
  public startDrag(dragging): void {
    this.dragging = dragging;
  }

  /**
   * Completes a drag action
   * @param target The target of drag
   */
  public drop(target): void {
    if (!!this.dragging) {
      console.log("Drag completed:", this.dragging, target);
      this.dragging = null;
    }
  }
}
