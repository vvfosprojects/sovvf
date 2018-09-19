import {Injectable} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {DescrizioneLocalita} from '../../../shared/model/descrizione-localita.model';
import {MarkedService} from '../marked-service/marked-service.service';

@Injectable({
    providedIn: 'root'
})
export class MapsServiceFake {

    private stati: any;
    private statiObj: any;
    private data: RichiestaMarker[] = [];

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
    }

    private _count: number;

    set count(count: number) {
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    private numeroMarker = 3;

    public getData(): Observable<RichiestaMarker[]> {
        this.data = [
            new RichiestaMarker(1,
                new DescrizioneLocalita(
                    'Via Cavour, 5',
                    [42.5131365, 12.773477]),
                2,
                'Allagamento cantina per rottura tubatura',
                false,
                3,
                'assegnata'
            ),
            new RichiestaMarker(2,
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
            this.data.push(new RichiestaMarker(
                _i + 1,
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
        return of(this.data);
    }

    setMarker(marker: RichiestaMarker) {
        this.data.push(marker);
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
        if (this.markerSelezionato && this.data.slice(-1).pop().id_richiesta === this.markerSelezionato.id_richiesta) {
            this.markedService.clearMarked();
        }
        this.data.pop();
    }

    // /* TESTING METHOD */
    changeMarkerColor() {
        const statoCasuale = Math.floor(Math.random() * 4) + 1;
        const color = this.data.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        color.stato = this.statiObj.get(statoCasuale);
        const colorCopy = JSON.parse(JSON.stringify(color));
        this.setMarker(colorCopy);
        const index = this.data.indexOf(this.markerSelezionato);
        if (index > -1) {
            this.data.splice(index, 1);
        }
        this.markedService.clearMarked();
    }


    /* TESTING METHOD */
    changeMarkerSize() {
        const size = this.data.find(x => x.id_richiesta === this.markerSelezionato.id_richiesta);
        if (size.prioritaRichiesta > 0 && size.prioritaRichiesta < 5) {
            size.prioritaRichiesta++;
        } else if (size.prioritaRichiesta === 5) {
            size.prioritaRichiesta = 1;
        }
        const sizeCopy = JSON.parse(JSON.stringify(size));
        this.setMarker(sizeCopy);
        const index = this.data.indexOf(this.markerSelezionato);
        if (index > -1) {
            this.data.splice(index, 1);
        }
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
        const index: number = this.data.indexOf(this.markerSelezionato);
        if (index !== -1) {
            this.data.splice(index, 1);
            this.markedService.clearMarked();
        }
    }
}
