import {Injectable} from '@angular/core';
import {EventiMaps} from './_marker';

@Injectable({
    providedIn: 'root'
})
export class EventiService {

    marker = new EventiMaps;

    constructor() {
    }

}
