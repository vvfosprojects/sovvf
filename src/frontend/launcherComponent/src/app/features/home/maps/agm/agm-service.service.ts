import {Injectable} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {CentroMappa} from '../maps-model/centro-mappa.model';
import {Coordinate} from '../../../../shared/model/coordinate.model';
import {CenterService} from '../service/center-service/center-service.service';
import {Subject} from 'rxjs';

declare var google: any;

@Injectable()
export class AgmService {

    map: any;
    centro$ = new Subject();

    constructor(private centerService: CenterService) {
        /**
         * subscribe che tiene aggiornato il centro mappa, quando questo viene cambiato dall'utente
         */
        this.centro$.pipe(
            debounceTime(500)).subscribe(
            coordinate => this.centerService.sendCentro(
                new CentroMappa(
                    new Coordinate(coordinate['lat'], coordinate['lng']),
                    this.map.getZoom()))
        );
    }

    cambiaZoom(zoom: number): void {
        /**
         * metodo che cambia lo zoom e si aspetta il number dello zoom,
         * inoltre effettua una transazione tra i vari livelli di zoom creando un effetto animato -> da fare.
         */
        if (!this.map) {
            return;
        }
        this.map.setZoom(zoom);
    }

    centraMappa(coordinate: Coordinate): void {
        /**
         * metodo che ricentra la mappa e si aspetta le coordinate del nuovo centro
         */
        const posizione = new google.maps.LatLng(coordinate.latitudine, coordinate.longitudine);
        this.map.panTo(posizione);
    }

}
