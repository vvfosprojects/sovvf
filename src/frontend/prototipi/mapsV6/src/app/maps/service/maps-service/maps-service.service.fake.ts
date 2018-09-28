import {Injectable} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {DescrizioneLocalita} from '../../../shared/model/descrizione-localita.model';
import {MarkedService} from '../marked-service/marked-service.service';
import {SedeMarker} from '../../maps-model/sede-marker.model';
import {MezzoMarker} from '../../maps-model/mezzo-marker.model';

@Injectable({
    providedIn: 'root'
})
export class MapsServiceFake {

    private richiesteMarker: RichiestaMarker[] = [];
    private sediMarker: SedeMarker[] = [];
    private mezziMarker: MezzoMarker[] = [];

    private stati: any;
    private statiObj: any;

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

    private numeroMarker = 30;

    public getRichiesteMarker(): Observable<RichiestaMarker[]> {
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

    public getSediMarker(): Observable<SedeMarker[]> {
        this.sediMarker = [
        ];
        return of(this.sediMarker);
    }

}
