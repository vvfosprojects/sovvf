import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SedeMarker } from '../../../../features/home/maps/maps-model/sede-marker.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';


@Injectable({
    providedIn: 'root'
})
export class SediMarkerServiceFake {

    private sediMarkers: SedeMarker[] = [];

    constructor() {
    }

    public getSediMarkers(): Observable<SedeMarker[]> {
        this.sediMarkers = [
            new SedeMarker('1', 'Comando di Roma', new Coordinate(41.899940, 12.491270), 'Via Genova, 1, 00184 Roma RM', 'Comando', 'Lazio', 'Roma'),
            new SedeMarker('2', 'Comando di Latina', new Coordinate(41.474258, 12.903250), 'Piazzale G. Carturan, 1, 04100 Latina LT', 'Comando', 'Lazio', 'Latina'),
            new SedeMarker('3', 'Comando di Frosinone', new Coordinate(41.616320, 13.310050), 'Via Dei Monti Lepini, 03100 Frosinone FR', 'Comando', 'Lazio', 'Frosinone'),
            new SedeMarker('4', 'Comando di Rieti', new Coordinate(42.397678, 12.858020), 'Via Sacchetti Sassetti, 1, 02100 Rieti RI', 'Comando', 'Lazio', 'Rieti'),
            new SedeMarker('5', 'Comando di Viterbo', new Coordinate(42.3736121, 12.1129142), 'Str. Cassia Nord, km 84, 01100 Viterbo VT', 'Comando', 'Lazio', 'Viterbo'),
            new SedeMarker('8', 'Distaccamento Cittadino La Rustica', new Coordinate(41.9095454, 12.6119425), 'Via Achille Vertunni, 98 00155 Roma', 'Distaccamento', 'Lazio', 'Roma'),
        ];
        return of(this.sediMarkers);
    }

}
