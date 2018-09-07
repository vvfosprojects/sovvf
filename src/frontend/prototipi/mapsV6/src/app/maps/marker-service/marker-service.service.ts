import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {Observable, of, Subscription} from 'rxjs';
import {MarkedService} from '../marked-service/marked-service.service';

@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    richiesteMarkers: RichiestaMarker[] = [];
    markerSelezionato: RichiestaMarker;
    subscription: Subscription;

    constructor(private markedService: MarkedService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
    }

    private _count: number;

    getMarkers(): Observable<RichiestaMarker[]> {
        return of(this.richiesteMarkers);
    }

    set count(count: number) {
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    setMarker(marker: RichiestaMarker) {
        this.richiesteMarkers.push(marker);
    }

    removeMarker(marker: RichiestaMarker) {
        this.richiesteMarkers = this.richiesteMarkers.filter(item => item.id_richiesta !== marker.id_richiesta);
    }

    changeMarkerColor(marker) {
        console.log('cambio colore al marker (service) ' + marker.id_richiesta);
    }

    changeMarkerSize(marker) {
        console.log('cambio dimensione al marker (service) ' + marker.id_richiesta);
    }

    changeMarkerAnimation(marker) {
        console.log('imposto animazione al marker(service) ' + marker.id_richiesta);
    }

    /* TESTING METHOD */
    setRandomMarker() {
        this.count++;
        const lat = Math.floor(Math.random() * 10000000) * 0.00000001 + 41.89;
        const long = Math.floor(Math.random() * 10000000) * 0.00000001 + 12.49;
        const markerRandom = new RichiestaMarker(
            this.count, {'indirizzo': 'Via Cavour, 5', 'coordinate': [lat, long]}, 1, 'Marker aggiunto Random', false, 3);
        this.setMarker(markerRandom);
    }

    /* TESTING METHOD */
    removeLastMarker() {
        if (this.markerSelezionato && this.richiesteMarkers.slice(-1).pop().id_richiesta === this.markerSelezionato.id_richiesta) {
            this.markedService.clearMarked();
            console.log('rimuovo il marker selezionato');
        }
        this.richiesteMarkers.pop();
    }

}
