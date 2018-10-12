import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { RichiestaMarker } from '../../maps-model/richiesta-marker.model';
import { Localita } from '../../../shared/model/localita.model';
import { MarkedService } from '../marked-service/marked-service.service';
import { SedeMarker } from '../../maps-model/sede-marker.model';
import { MezzoMarker } from '../../maps-model/mezzo-marker.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { Componente } from '../../../shared/model/componente.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { Sede } from '../../../shared/model/sede.model';
import { Mezzo } from '../../../shared/model/mezzo.model';

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

    private numeroMarker = 20;

    getRichiesteMarker(): Observable<RichiestaMarker[]> {
        this.richiesteMarker = [
            new RichiestaMarker('R1',
                new Localita(
                    new Coordinate(42.5131365, 12.773477),
                    'Via Cavour, 5',
                ),
                [
                    new Tipologia(1, 'allagamento', '')
                ],
                'Allagamento cantina per rottura tubatura',
                false,
                3,
                'assegnata'
            ),
            new RichiestaMarker('R2',
                new Localita(
                    new Coordinate(42.8131365, 12.773477),
                    'Via Cavour, 5',
                ),
                [
                    new Tipologia(2, 'incendio', '')
                ],
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
                new Localita(
                    new Coordinate(Math.floor(Math.random() * 100) * 0.01 + 41.895, Math.floor(Math.random() * 100) * 0.01 + 12.495),
                    'Via Cavour, 5'
                ),
                [
                    new Tipologia(1, 'allagamento', '')
                ],
                'Marker Random: ' + this.statiObj.get(randomNumber),
                false,
                Math.floor(Math.random() * 5) + 1,
                this.statiObj.get(randomNumber)
            )
            );
        }
        return of(this.richiesteMarker);
    }

    getSediMarker(): Observable<SedeMarker[]> {
        this.sediMarker = [
            new SedeMarker(1, 'Tuscolano I', new Coordinate(41.881490, 12.518700), 'Distaccamento')
            ,
            new SedeMarker(2, 'Tuscolano II', new Coordinate(41.863930, 12.554420), 'Distaccamento')
            ,
            new SedeMarker(3, 'Roma', new Coordinate(41.899940, 12.491270), 'Comando')
            ,
            new SedeMarker(3, 'Roma', new Coordinate(41.8748856, 12.4071855), 'Direzioni')
        ];
        return of(this.sediMarker);
    }

    getMezziMarker(): Observable<MezzoMarker[]> {
        this.mezziMarker = [
            new MezzoMarker(
                new Coordinate(41.3593378, 13.4284407),
                new Mezzo('1', 'Autobotte', 'ABP', 'InViaggio', 5),
                'R1',
                [
                    new Squadra('1A', 'InViaggio',
                        [
                            new Componente(
                                'CR',
                                'Mario Rossi',
                                'Mario Rossi - MRORSS45H44T656R',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Antonio Bianchi',
                                'Antonio Bianchi - NTNBNC76T54H444T',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Matteo Verdi',
                                'Matteo Verdi - VRDMTT56G77D454I',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Enrico Ottavi',
                                'Enrico Ottavi - NRCOTT88U75F454H',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Michele Rettore',
                                'Michele Rettore - MCHRTT65T65K575Q',
                                false,
                                false,
                                true),
                        ], null)
                ], 'Mezzo in soccorso'
            ),
            new MezzoMarker(
                new Coordinate(41.4171741, 13.5509798),
                new Mezzo('1', 'Autobotte2', 'ABP', 'InViaggio', 5),
                'R1',
                [
                    new Squadra('1A', 'InViaggio',
                        [
                            new Componente(
                                'CR',
                                'Mario Rossi',
                                'Mario Rossi - MRORSS45H44T656R',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Antonio Bianchi',
                                'Antonio Bianchi - NTNBNC76T54H444T',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Matteo Verdi',
                                'Matteo Verdi - VRDMTT56G77D454I',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Enrico Ottavi',
                                'Enrico Ottavi - NRCOTT88U75F454H',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Michele Rettore',
                                'Michele Rettore - MCHRTT65T65K575Q',
                                false,
                                false,
                                true),
                        ], null)
                ], 'Mezzo in soccorso'
            ),
            new MezzoMarker(
                new Coordinate(41.4023582, 13.3406784),
                new Mezzo('1', 'Autobotte3', 'ABP', 'InViaggio', 5),
                'R1',
                [
                    new Squadra('1A', 'InViaggio',
                        [
                            new Componente(
                                'CR',
                                'Mario Rossi',
                                'Mario Rossi - MRORSS45H44T656R',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Antonio Bianchi',
                                'Antonio Bianchi - NTNBNC76T54H444T',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Matteo Verdi',
                                'Matteo Verdi - VRDMTT56G77D454I',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Enrico Ottavi',
                                'Enrico Ottavi - NRCOTT88U75F454H',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Michele Rettore',
                                'Michele Rettore - MCHRTT65T65K575Q',
                                false,
                                false,
                                true),
                        ], null)
                ], 'Mezzo in soccorso'
            )
        ];
        return of(this.mezziMarker);
    }

}
