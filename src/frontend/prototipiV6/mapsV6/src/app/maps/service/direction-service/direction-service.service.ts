import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DirectionInterface } from './direction-interface';

@Injectable({
    providedIn: 'root'
})
export class DirectionService {

    private directionSubject = new Subject<DirectionInterface>();

    directionOff: DirectionInterface = {
        isVisible: false
    };

    constructor() {
    }

    sendDirection(direction: DirectionInterface) {
        this.directionSubject.next(direction);
    }

    clearDirection() {
        this.directionSubject.next(this.directionOff);
    }

    getDirection(): Observable<DirectionInterface> {
        return this.directionSubject.asObservable();
    }

}
