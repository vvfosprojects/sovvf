import {Injectable} from '@angular/core';
import {EventiMaps} from './_marker';
import {EventiListaRichieste} from './_richiesta';

@Injectable({
    providedIn: 'root'
})
export class EventiService {

    marker = new EventiMaps;
    richiesta = new EventiListaRichieste;

    constructor() {
    }

}
