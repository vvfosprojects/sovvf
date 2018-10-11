import {Injectable} from '@angular/core';
import {EventiMapsFake} from './_marker';
import {MapManagerService} from '../maps/service/maps-manager/map-manager-service.service';

@Injectable({
    providedIn: 'root'
})
export class EventiServiceFake {

    marker = new EventiMapsFake;

    constructor() {
    }

}
