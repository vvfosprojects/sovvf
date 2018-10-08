import {Injectable} from '@angular/core';
import {EventiMapsFake} from './_marker';

@Injectable({
    providedIn: 'root'
})
export class EventiServiceFake {

    marker = new EventiMapsFake;

    constructor() {
    }

}
