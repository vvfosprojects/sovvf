import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {DescrizioneLocalita} from '../../shared/model/descrizione-localita.model';

@Injectable({
    providedIn: 'root'
})
export class MapsServiceFake {

    constructor() {
    }

    public getData() {
        const data: RichiestaMarker[] = [
            new RichiestaMarker(1,
                new DescrizioneLocalita(
                    'Via Cavour, 5',
                    [42.5131365, 12.773477]),
                1,
                'Allagamento cantina per rottura tubatura',
                true,
                3
            )
        ];
        return of(data);
    }
}
