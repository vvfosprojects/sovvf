import { ElementRef, Renderer } from '@angular/core';

export class DndInfo {
    constructor(
        public readonly model: any,
        public readonly element: ElementRef,
        public readonly renderer: Renderer) {}
}