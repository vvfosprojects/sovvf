import {Injectable} from '@angular/core';
import {EventiListaRichiesteFake} from './_richiesta';

@Injectable({
    providedIn: 'root'
})
export class EventiServiceFake {

    richiesta = new EventiListaRichiesteFake;

    constructor() {
    }

}
