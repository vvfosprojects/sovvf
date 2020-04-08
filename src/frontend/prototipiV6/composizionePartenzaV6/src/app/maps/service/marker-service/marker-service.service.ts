import { Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    switchMeteo: boolean;

    constructor() {
    }

    partenza(id: string, action: string, centroMappa?) {
    }

    noAction() {
        return;
    }

}
