import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {of} from 'rxjs';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {DescrizioneLocalita} from '../../model/descrizione-localita.model';
import {IconMarker} from '../../model/icon-marker.model';

@Injectable({
    providedIn: 'root'
})
export class MapsServiceFake {

    // data: RichiestaMarker[];

    constructor() {
    }

    public getData() {
        const data: RichiestaMarker[] = [
            new RichiestaMarker(1,
                new DescrizioneLocalita(
                    'Via Cavour, 5',
                    [41.900570, 12.499370]),
                1,
                'Allagamento cantina per rottura tubatura',
                true
            )
        ];
        return of(data);
    }
}
