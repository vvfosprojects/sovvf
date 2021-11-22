import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[appDebounceKeyUp]'
})
export class DebounceKeyUpDirective implements OnInit, OnDestroy {

    @Input() debounceTime = 500;

    @Output() debounceKeyUp = new EventEmitter();

    private keyUps = new Subject();
    private subscription = new Subscription();

    constructor() {
    }

    ngOnInit(): void {
        this.subscription.add(this.keyUps.pipe(
            debounceTime(this.debounceTime)
        ).subscribe(e => this.debounceKeyUp.emit(e)));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    @HostListener('keyup', ['$event'])
    keyUpEvent(event): void {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.keyUps.next(event);
        }
    }
}
