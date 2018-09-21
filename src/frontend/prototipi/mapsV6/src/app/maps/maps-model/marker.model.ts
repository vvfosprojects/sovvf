import {DescrizioneLocalita} from '../../shared/model/descrizione-localita.model';

export abstract class Marker {
    constructor(
        /* La stringa dell'indirizzo e le relative coordinate */
        public localita: DescrizioneLocalita,
    ) {
    }
}
