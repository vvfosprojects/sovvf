import {Injectable} from '@angular/core';
import {MapManagerService} from '../../maps/service/maps-manager/map-manager-service.service';
import {EventiMaps} from './_marker';
import {EventiListaRichieste} from './_richiesta';

@Injectable({
    providedIn: 'root'
})
export class EventiService {

    marker = new EventiMaps;
    richiesta = new EventiListaRichieste(this.markerC);

    constructor(private markerC: MapManagerService) {
    }

}
