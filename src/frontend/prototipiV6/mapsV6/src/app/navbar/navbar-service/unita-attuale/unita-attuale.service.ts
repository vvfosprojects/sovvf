import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UnitaAttualeService {

    preLoader: boolean;

    constructor() {
        this.preLoader = true;
    }

    sendUnitaOperativaAttuale(sede) {
        /**
         * progress bar fake
         */
        this.preLoader = false;
        // console.log(sede);
        /** request completed */
        setTimeout(() => {
            this.preLoader = true;
        }, 2500);
    }
}

