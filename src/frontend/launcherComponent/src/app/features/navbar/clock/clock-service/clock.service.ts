import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { OFFSET_SYNC_TIME } from '../../../../core/settings/referral-time';


@Injectable({
    providedIn: 'root'
})
export class ClockService {

    readonly clock: Observable<Date>;

    private refreshRate = 1000;

    constructor() {
        this.clock = interval(this.refreshRate).pipe(
            map(() => new Date(new Date().getTime() + OFFSET_SYNC_TIME[0])));
    }

    getClock(): Observable<Date> {
        return this.clock;
    }

}
