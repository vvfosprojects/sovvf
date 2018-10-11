import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FakerCambioSedeService {

    preLoader: boolean;

    constructor() {
        this.preLoader = true;
    }

    cambioSedeFake() {
        /**
         * progress bar fake
         */
        this.preLoader = false;

        /** request completed */
        setTimeout(() => {
            this.preLoader = true;
        }, 2500);
    }
}
