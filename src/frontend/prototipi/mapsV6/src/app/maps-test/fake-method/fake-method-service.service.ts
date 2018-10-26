import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../../maps/maps-model/richiesta-marker.model';
import {Subscription} from 'rxjs';
import {MarkedService} from '../../maps/service/marked-service/marked-service.service';
import {CenterService} from '../../maps/service/center-service/center-service.service';
import {Localita} from '../../shared/model/localita.model';
import {Coordinate} from '../../shared/model/coordinate.model';
import {Tipologia} from '../../shared/model/tipologia.model';
import {CentroMappa} from '../../maps/maps-model/centro-mappa.model';
import {DispatcherRichiesteMarkerService} from '../../core/dispatcher/dispatcher-maps/richieste-marker/dispatcher-richieste-marker.service';
import {DispatcherCentroMappaService} from '../../core/dispatcher/dispatcher-maps/centro-mappa/dispatcher-centro-mappa.service';
import {CentroMappaManagerService, RichiesteMarkerManagerService} from '../../core/manager/maps-manager';

@Injectable({
    providedIn: 'root'
})
export class FakeMethodService {

    private stati: any;
    private statiObj: any;

    markerSelezionato: any;
    selezione: Subscription;

    constructor(private markedService: MarkedService,
                private richiesteManager: RichiesteMarkerManagerService,
                private centroManager: CentroMappaManagerService,
                private dispatcherRichieste: DispatcherRichiesteMarkerService,
                private dispatcherCentro: DispatcherCentroMappaService,
                private centerService: CenterService) {
        this.selezione = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
        this.stati = [
            [1, 'chiamata'],
            [2, 'assegnato'],
            [3, 'presidiato'],
            [4, 'sospeso']
        ];
        this.statiObj = new Map(this.stati);
    }

    /* TESTING METHOD */
    setMarker(marker: RichiestaMarker) {
        this.dispatcherRichieste.addMarker(marker);
    }

    /* TESTING METHOD */
    setRandomMarker() {
        this.richiesteManager.count++;
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        const lat = Math.floor(Math.random() * 10) * 0.1 + 41.89;
        const long = Math.floor(Math.random() * 10) * 0.1 + 12.49;
        const markerRandom = new RichiestaMarker(
            'R' + this.richiesteManager.count,
            new Localita(new Coordinate(lat, long), 'Via Cavour, 5'),
            [
                new Tipologia('1', 'allagamento', '')
            ],
            'Marker Random: ' + this.statiObj.get(randomNumber),
            Math.floor(Math.random() * 5) + 1,
            this.statiObj.get(randomNumber));
        this.setMarker(markerRandom);
    }

    /* TESTING METHOD */
    removeLastMarker() {
        if (this.markerSelezionato &&
            this.richiesteManager.richiesteMarker.slice(-1).pop().id === this.markerSelezionato.id) {
            this.markedService.clearMarked();
        }
        this.richiesteManager.richiesteMarker.pop();
    }

    /* TESTING METHOD */
    changeMarkerColor() {
        const statoCasuale = Math.floor(Math.random() * 4) + 1;
        const color = this.richiesteManager.richiesteMarker.find(x => x.id === this.markerSelezionato.id);
        color.stato = this.statiObj.get(statoCasuale);
        // this.dispatcher.updateMarker(color);
        this.markedService.clearMarked();
    }


    /* TESTING METHOD */
    changeMarkerSize() {
        const size = this.richiesteManager.richiesteMarker.find(x => x.id === this.markerSelezionato.id);
        if (size.priorita > 0 && size.priorita < 5) {
            size.priorita++;
        } else if (size.priorita === 5) {
            size.priorita = 1;
        }
        // this.dispatcher.updateMarker(size);
        this.markedService.clearMarked();
    }

    /* TESTING METHOD */
    changeMarkerAnimation() {
        /**
         * metodo da rivedere con gmaps...
         */
        // const statoCasuale = Math.floor(Math.random() * 4) + 1;
        // console.log(statoCasuale);
        console.log('modifico animazione al marker selezionato');
    }

    /* TESTING METHOD */
    removeMarker() {
        const remove = this.richiesteManager.richiesteMarker.find(x => x.id === this.markerSelezionato.id);
        this.dispatcherRichieste.deleteMarker(remove);
        this.markedService.clearMarked();
    }

    aggiornaCentro(centro?) {
        if (centro) {
            this.centerService.clearCentro();
            this.centerService.sendCentro(centro);
        } else {
            const test = new CentroMappa(new Coordinate(43.5330, 11.3040), 8);
            this.dispatcherCentro.updateCentro(test);
        }
    }

    getMarker(id) {
        const marker = this.richiesteManager.richiesteMarker.find(x => x.id === id);
        console.log(marker);
    }

    calcolaCentro() {
        this.centroManager.calcCenter();
    }
}

