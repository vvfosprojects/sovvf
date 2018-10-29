import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MezzoMarker } from '../../../../maps/maps-model/mezzo-marker.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Squadra } from '../../../../shared/model/squadra.model';
import { Componente } from '../../../../shared/model/componente.model';
import { Mezzo } from '../../../../shared/model/mezzo.model';


@Injectable({
    providedIn: 'root'
})
export class MezziMarkerServiceFake {

    private mezziMarkers: MezzoMarker[] = [];

    constructor() {
    }

    public getMezziMarkers(): Observable<MezzoMarker[]> {
        this.mezziMarkers = [
            new MezzoMarker(
                new Coordinate(41.3593378, 13.4284407),
                new Mezzo('1', 'Autobotte', 'ABP', 'InViaggio', 1, 'appartenenza', 'stato', 2, 'efficienza',
                    3, 'carburante', 2, 'estinguente'),
                'RM-00001',
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
                        ]),
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
                        ])
                ], 'Mezzo in soccorso'
            ),
            new MezzoMarker(
                new Coordinate(41.4171741, 13.5509798),
                new Mezzo('1', 'Autobotte2', 'ABP', 'InRientro', 1),
                'RM-00002',
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
                        ])
                ], 'Mezzo in soccorso'
            ),
            new MezzoMarker(
                new Coordinate(41.4023582, 13.3406784),
                new Mezzo('1', 'Autobotte3', 'ABP', 'SulPosto', 5),
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
                        ])
                ], 'Mezzo in soccorso'
            )
        ];
        return of(this.mezziMarkers);
    }
}
