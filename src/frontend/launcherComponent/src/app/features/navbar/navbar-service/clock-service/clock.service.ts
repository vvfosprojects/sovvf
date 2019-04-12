import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClockService {

    readonly clock: Observable<Date>;

    private refreshRate = 1000;

    constructor() {
        this.clock = interval(this.refreshRate).pipe(
            map(() => new Date()));
    }

    getClock(): Observable<Date> {
        return this.clock;
    }

}
