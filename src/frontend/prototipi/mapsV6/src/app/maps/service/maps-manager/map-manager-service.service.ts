import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {Observable, of, Subscription} from 'rxjs';
import {DispatcherService} from '../../dispatcher/dispatcher.service';
import {MarkedService} from '../marked-service/marked-service.service';
import {CentroMappa} from '../../maps-model/centro-mappa.model';

@Injectable({
    providedIn: 'root'
})
export class MapManagerService {

    richiesteMarker: RichiestaMarker[];

    private stati: any;
    private statiObj: any;

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;

    constructor(private dispatcher: DispatcherService,
                private markedService: MarkedService) {

        this.dispatcher.onNewMarkerList().subscribe(richieste => {
            this.richiesteMarker = richieste;
        });

        this.dispatcher.onNewMarker().subscribe(richiesta => {
            this.richiesteMarker.unshift(richiesta);
        });

        this.dispatcher.onUpdateMarker().subscribe(richiesta => {
            this.richiesteMarker = this.richiesteMarker.map(r => r.id_richiesta === richiesta.id_richiesta ? richiesta : r);
        });

        this.dispatcher.onDeleteMarker().subscribe(richiesta => {
            this.richiesteMarker = this.richiesteMarker.filter(x => x.id_richiesta === richiesta.id_richiesta);
        });

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

    private _count: number;

    set count(count: number) {
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    getData(): Observable<RichiestaMarker[]> {
        return of(this.richiesteMarker);
    }

    /* TESTING METHOD */
    private setMarker(marker: RichiestaMarker) {
        this.dispatcher.addMarker(marker);
    }

    /* TESTING METHOD */
    setRandomMarker() {
        this.count++;
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        const lat = Math.floor(Math.random() * 10) * 0.1 + 41.89;
        const long = Math.floor(Math.random() * 10) * 0.1 + 12.49;
        const markerRandom = new RichiestaMarker(
            this.count,
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
        if (this.markerSelezionato && this.richiesteMarker.slice(-1).pop().id_richiesta === this.markerSelezionato.id_richiesta) {
            this.markedService.clearMarked();
        }
        this.richiesteMarker.pop();
    }

    // /* TESTING METHOD */
    changeMarkerColor() {
        const statoCasuale = Math.floor(Math.random() * 4) + 1;
        const color = this.richiesteMarker.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        color.stato = this.statiObj.get(statoCasuale);
        const colorCopy = JSON.parse(JSON.stringify(color));
        this.setMarker(colorCopy);
        const index = this.richiesteMarker.indexOf(this.markerSelezionato);
        if (index > -1) {
            this.richiesteMarker.splice(index, 1);
        }
        this.markedService.clearMarked();
    }


    /* TESTING METHOD */
    changeMarkerSize() {
        const size = this.richiesteMarker.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        if (size.prioritaRichiesta > 0 && size.prioritaRichiesta < 5) {
            size.prioritaRichiesta++;
        } else if (size.prioritaRichiesta === 5) {
            size.prioritaRichiesta = 1;
        }
        // const sizeCopy = JSON.parse(JSON.stringify(size));
        // this.setMarker(sizeCopy);
        // const index = this.richiesteMarker.indexOf(this.markerSelezionato);
        // if (index > -1) {
        //     this.richiesteMarker.splice(index, 1);
        // }
        /**
         * da completare
         */
        this.dispatcher.updateMarker(size);
        this.markedService.clearMarked();
    }

    /* TESTING METHOD */
    changeMarkerAnimation() {
        // const statoCasuale = Math.floor(Math.random() * 4) + 1;
        // console.log(statoCasuale);
        console.log('modifico animazione al marker selezionato');
    }

    /* TESTING METHOD */
    removeMarker() {
        const index: number = this.richiesteMarker.indexOf(this.markerSelezionato);
        if (index !== -1) {
            this.richiesteMarker.splice(index, 1);
            this.markedService.clearMarked();
        }
    }
}
