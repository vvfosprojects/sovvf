import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    constructor() {
    }

    action(marker, mouse) {
        // console.log('Action: ' + marker + ' | ' + mouse);
    }

    actionById(id, mouse) {
        // console.log('Action: ' + id + ' | ' + mouse);
    }

    noAction() {
        // console.log('No action');
    }

    opacizzaMarkers(a, b, c?, d?) {
    }
}
