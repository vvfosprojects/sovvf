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

    /* TESTING METHOD */
    setRandomMarker() {
        this.count++;
        const lat = Math.floor(Math.random() * 10) * 0.1 + 41.89;
        const long = Math.floor(Math.random() * 10) * 0.1 + 12.49;
        const markerRandom = new RichiestaMarker(
            this.count,
            {'indirizzo': 'Via Cavour, 5', 'coordinate': [lat, long]},
            Math.floor(Math.random() * 5) + 1,
            'Marker aggiunto Random',
            false,
            Math.floor(Math.random() * 5) + 1);
        this.setMarker(markerRandom);
    }

    /* TESTING METHOD */
    removeLastMarker() {
        if (this.markerSelezionato && this.richiesteMarkers.slice(-1).pop().id_richiesta === this.markerSelezionato.id_richiesta) {
            this.markedService.clearMarked();
        }
        this.richiesteMarkers.pop();
    }

    /* TESTING METHOD */
    changeMarkerColor() {
        const color = this.richiesteMarkers.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        if (color.id_tipologia > 0 && color.id_tipologia < 5) {
            color.id_tipologia++;
        } else if (color.id_tipologia === 5) {
            color.id_tipologia = 1;
        }
        const colorCopy = JSON.parse(JSON.stringify(color));
        this.setMarker(colorCopy);
        const index = this.richiesteMarkers.indexOf(this.markerSelezionato);
        if (index > -1) {
            this.richiesteMarkers.splice(index, 1);
        }
        this.markedService.clearMarked();
    }

    /* TESTING METHOD */
    changeMarkerSize() {
        const size = this.richiesteMarkers.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        if (size.prioritaRichiesta > 0 && size.prioritaRichiesta < 5) {
            size.prioritaRichiesta++;
        } else if (size.prioritaRichiesta === 5) {
            size.prioritaRichiesta = 1;
        }
        const sizeCopy = JSON.parse(JSON.stringify(size));
        this.setMarker(sizeCopy);
        const index = this.richiesteMarkers.indexOf(this.markerSelezionato);
        if (index > -1) {
            this.richiesteMarkers.splice(index, 1);
        }
        this.markedService.clearMarked();
    }

    /* TESTING METHOD */
    changeMarkerAnimation() {
        const animation = this.richiesteMarkers.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        animation.rilevante = !animation.rilevante;
    }

    /* TESTING METHOD */
    removeMarker() {
        const index: number = this.richiesteMarkers.indexOf(this.markerSelezionato);
        if (index !== -1) {
            this.richiesteMarkers.splice(index, 1);
            this.markedService.clearMarked();
        }
    }

}
