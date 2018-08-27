import {Marker} from './marker.model';
import {DescrizioneLocalita} from './descrizione-localita.model';

export class RichiestaMarker implements Marker {
    constructor(
        /* id */
        public id: number,
        /* La stringa dell'indirizzo e le relative coordinate */
        public localita: DescrizioneLocalita,
        /* La classe dell'icona da visualizzare */
        public icon: string,
        /* Contiene la descrizione della label da mostrare */
        public label: string,
        /* Determina la rilevanza del marcatore */
        public rilevante: boolean
    ) {
    }
}
