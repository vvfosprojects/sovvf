import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {Subscription} from 'rxjs';
import {MarkedService} from '../../service/marked-service/marked-service.service';
import {MapManagerService} from '../../service/maps-manager/map-manager-service.service';
import {CenterService} from '../../service/center-service/center-service.service';

@Injectable({
    providedIn: 'root'
})
export class FakeMethodService {

    private stati: any;
    private statiObj: any;

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;

    constructor(private markedService: MarkedService,
                private mapManager: MapManagerService,
                private centerService: CenterService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
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
        this.mapManager.richiesteMarker.push(marker);
    }

    /* TESTING METHOD */
    setRandomMarker() {
        this.mapManager.count++;
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        const lat = Math.floor(Math.random() * 10) * 0.1 + 41.89;
        const long = Math.floor(Math.random() * 10) * 0.1 + 12.49;
        const markerRandom = new RichiestaMarker(
            'R' + this.mapManager.count,
            {'indirizzo': 'Via Cavour, 5', 'coordinate': [lat, long]},
            Math.floor(Math.random() * 5) + 1,
            'Marker Random: ' + this.statiObj.get(randomNumber),
            false,
            Math.floor(Math.random() * 5) + 1,
            this.statiObj.get(randomNumber));
        this.setMarker(markerRandom);
    }

    /* TESTING METHOD */
    removeLastMarker() {
        if (this.markerSelezionato &&
            this.mapManager.richiesteMarker.slice(-1).pop().id_richiesta === this.markerSelezionato.id_richiesta) {
            this.markedService.clearMarked();
        }
        this.mapManager.richiesteMarker.pop();
    }

    /* TESTING METHOD */
    changeMarkerColor() {
        const statoCasuale = Math.floor(Math.random() * 4) + 1;
        const color = this.mapManager.richiesteMarker.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        color.stato = this.statiObj.get(statoCasuale);
        const colorCopy = JSON.parse(JSON.stringify(color));
        this.setMarker(colorCopy);
        const index = this.mapManager.richiesteMarker.indexOf(this.markerSelezionato);
        if (index > -1) {
            this.mapManager.richiesteMarker.splice(index, 1);
        }
        this.markedService.clearMarked();
    }


    /* TESTING METHOD */
    changeMarkerSize() {
        const size = this.mapManager.richiesteMarker.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        if (size.prioritaRichiesta > 0 && size.prioritaRichiesta < 5) {
            size.prioritaRichiesta++;
        } else if (size.prioritaRichiesta === 5) {
            size.prioritaRichiesta = 1;
        }
        const sizeCopy = JSON.parse(JSON.stringify(size));
        this.setMarker(sizeCopy);
        const index = this.mapManager.richiesteMarker.indexOf(this.markerSelezionato);
        if (index > -1) {
            this.mapManager.richiesteMarker.splice(index, 1);
        }
        /**
         * da completare
         */
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
        const index: number = this.mapManager.richiesteMarker.indexOf(this.markerSelezionato);
        if (index !== -1) {
            this.mapManager.richiesteMarker.splice(index, 1);
            this.markedService.clearMarked();
        }
    }

    aggiornaCentro(centro) {
        this.centerService.clearCentro();
        this.centerService.sendCentro(centro);
    }

}
