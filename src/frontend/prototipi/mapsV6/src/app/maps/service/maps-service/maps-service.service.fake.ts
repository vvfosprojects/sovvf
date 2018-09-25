import {Injectable} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {DescrizioneLocalita} from '../../../shared/model/descrizione-localita.model';
import {MarkedService} from '../marked-service/marked-service.service';
import {CentroMappa} from '../../maps-model/centro-mappa.model';
import {Coordinate} from '../../../shared/model/coordinate.model';

@Injectable({
    providedIn: 'root'
})
export class MapsServiceFake {

    private stati: any;
    private statiObj: any;
    private richiesteMarker: RichiestaMarker[] = [];
    private centroMappa: CentroMappa;
    private initCentroMappa: CentroMappa;
    private newCentroMappa: CentroMappa;

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;

    constructor(private markedService: MarkedService) {
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
        /**
         *  creo un oggetto di tipo centroMappa per inizializzare la mappa
         */
        this.centroMappa = new CentroMappa(new Coordinate(42.290251, 12.492373), 8);
        /* Roma */
        this.newCentroMappa = new CentroMappa(new Coordinate(45.283828, 9.105340), 8);
        /* Milano */
    }

    // private _count: number;
    //
    // set count(count: number) {
    //     this._count = count;
    // }
    //
    // get count(): number {
    //     return this._count;
    // }

    private numeroMarker = 30;

    public getData(): Observable<RichiestaMarker[]> {
        this.richiesteMarker = [
            new RichiestaMarker('R1',
                new DescrizioneLocalita(
                    'Via Cavour, 5',
                    [42.5131365, 12.773477]),
                2,
                'Allagamento cantina per rottura tubatura',
                false,
                3,
                'assegnata'
            ),
            new RichiestaMarker('R2',
                new DescrizioneLocalita(
                    'Via Cavour, 5',
                    [42.8131365, 12.773477]),
                5,
                'Incendio sul bordo autostradale',
                false,
                5,
                'chiamata'
            )


        ];

        // ciclo for per inserire altri n marker casuali all'inizio del caricamento della mappa
        for (let _i = 2; _i < this.numeroMarker; _i++) {
            const randomNumber = Math.floor(Math.random() * 4) + 1;
            this.richiesteMarker.push(new RichiestaMarker(
                'R' + (_i + 1),
                {
                    'indirizzo': 'Via Cavour, 5',
                    'coordinate': [Math.floor(Math.random() * 100) * 0.01 + 41.895, Math.floor(Math.random() * 100) * 0.01 + 12.495]
                },
                Math.floor(Math.random() * 5) + 1,
                'Marker Random: ' + this.statiObj.get(randomNumber),
                false,
                Math.floor(Math.random() * 5) + 1,
                this.statiObj.get(randomNumber)
                )
            );
        }
        return of(this.richiesteMarker);
    }

    public getCentro(): Observable<CentroMappa> {
        // this.centroMappa = new CentroMappa(new Coordinate(42.290251, 12.492373), 8);
        return of(this.centroMappa);
    }

    // /* TESTING METHOD */
    // private setMarker(marker: RichiestaMarker) {
    //     this.richiesteMarker.push(marker);
    // }
    //
    // /* TESTING METHOD */
    // setRandomMarker() {
    //     this.count++;
    //     const randomNumber = Math.floor(Math.random() * 4) + 1;
    //     const lat = Math.floor(Math.random() * 10) * 0.1 + 41.89;
    //     const long = Math.floor(Math.random() * 10) * 0.1 + 12.49;
    //     const markerRandom = new RichiestaMarker(
    //         this.count,
    //         {'indirizzo': 'Via Cavour, 5', 'coordinate': [lat, long]},
    //         Math.floor(Math.random() * 5) + 1,
    //         'Marker Random: ' + this.statiObj.get(randomNumber),
    //         false,
    //         Math.floor(Math.random() * 5) + 1,
    //         this.statiObj.get(randomNumber));
    //     this.setMarker(markerRandom);
    // }
    //
    // /* TESTING METHOD */
    // removeLastMarker() {
    //     if (this.markerSelezionato && this.richiesteMarker.slice(-1).pop().id_richiesta === this.markerSelezionato.id_richiesta) {
    //         this.markedService.clearMarked();
    //     }
    //     this.richiesteMarker.pop();
    // }
    //
    // // /* TESTING METHOD */
    // changeMarkerColor() {
    //     const statoCasuale = Math.floor(Math.random() * 4) + 1;
    //     const color = this.richiesteMarker.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
    //     color.stato = this.statiObj.get(statoCasuale);
    //     const colorCopy = JSON.parse(JSON.stringify(color));
    //     this.setMarker(colorCopy);
    //     const index = this.richiesteMarker.indexOf(this.markerSelezionato);
    //     if (index > -1) {
    //         this.richiesteMarker.splice(index, 1);
    //     }
    //     this.markedService.clearMarked();
    // }
    //
    //
    // /* TESTING METHOD */
    // changeMarkerSize() {
    //     const size = this.richiesteMarker.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
    //     if (size.prioritaRichiesta > 0 && size.prioritaRichiesta < 5) {
    //         size.prioritaRichiesta++;
    //     } else if (size.prioritaRichiesta === 5) {
    //         size.prioritaRichiesta = 1;
    //     }
    //     const sizeCopy = JSON.parse(JSON.stringify(size));
    //     this.setMarker(sizeCopy);
    //     const index = this.richiesteMarker.indexOf(this.markerSelezionato);
    //     if (index > -1) {
    //         this.richiesteMarker.splice(index, 1);
    //     }
    //     this.markedService.clearMarked();
    // }
    //
    // /* TESTING METHOD */
    // changeMarkerAnimation() {
    //     // const statoCasuale = Math.floor(Math.random() * 4) + 1;
    //     // console.log(statoCasuale);
    //     console.log('modifico animazione al marker selezionato');
    // }
    //
    // /* TESTING METHOD */
    // removeMarker() {
    //     const index: number = this.richiesteMarker.indexOf(this.markerSelezionato);
    //     if (index !== -1) {
    //         this.richiesteMarker.splice(index, 1);
    //         this.markedService.clearMarked();
    //     }
    // }

    /* TESTING METHOD */
    setCentroMappa(newCentro = this.newCentroMappa) {
        console.log('centro mappa');
        const currentCentroMappa = Object.assign({}, this.centroMappa);
        if (!this.initCentroMappa) {
            this.initCentroMappa = Object.assign({}, this.centroMappa);
            // console.log(this.centroMappa);
        }
        if (Object.is(JSON.stringify(this.centroMappa), JSON.stringify(newCentro))) {
            // console.log('centro mappa attuale e nuovo centro mappa sono identici')
            this.centroMappa = this.initCentroMappa;
        }
        if (Object.is(JSON.stringify(currentCentroMappa), JSON.stringify(this.initCentroMappa))) {
            // console.log('centro mappa attuale e centro mappa iniziale sono identici');
            this.centroMappa = newCentro;
        }
    }
}
