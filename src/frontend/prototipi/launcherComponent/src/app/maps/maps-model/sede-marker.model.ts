import {Marker} from './marker.model';
import {DescrizioneLocalita} from '../../shared/model/descrizione-localita.model';

export class SedeMarker implements Marker {
    constructor(
        /* Codice della sede */
        public codice: number,
        /* nominativo della sede */
        public descrizione: string,
        /* tipologia della sede */
        public tipologiaSede: string,
        /* La stringa dell'indirizzo e le relative coordinate */
        public localita: DescrizioneLocalita,
        /* Contiene la descrizione della label da mostrare */
        public label: string,
        /* stemma della sede */
        public icona: string
    ) {
    }
}
