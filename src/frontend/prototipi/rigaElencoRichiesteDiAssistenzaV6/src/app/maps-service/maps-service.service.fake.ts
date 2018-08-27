import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../model/richiesta-marker.model';
import {DescrizioneLocalita} from '../model/descrizione-localita.model';

@Injectable({
    providedIn: 'root'
})
export class MapsServiceFake {

    data: RichiestaMarker[];

    constructor() {
    }

    public getData() {
        return this.data = [
            new RichiestaMarker(1,
                new DescrizioneLocalita(
                    'Via Cavour, 5',
                    [41.900570, 12.499370]),
                'https://goo.gl/HyNGJm',
                'Allagamento cantina per rottura tubatura',
                true
            )
        ];
    }
}
