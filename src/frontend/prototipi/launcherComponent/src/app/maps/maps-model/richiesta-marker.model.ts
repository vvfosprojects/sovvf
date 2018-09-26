import {Marker} from './marker.model';
import {DescrizioneLocalita} from '../../shared/model/descrizione-localita.model';

export class RichiestaMarker implements Marker {
    constructor(
        /* id */
        public id_richiesta: string,
        /* La stringa dell'indirizzo e le relative coordinate */
        public localita: DescrizioneLocalita,
        /* Id del tipo tipologia */
        public id_tipologia: number,
        /* Contiene la descrizione della label da mostrare */
        public label: string,
        /* Determina la rilevanza del marcatore */
        public rilevante: boolean,
        /* Determina la priorità del marcatore per scegliere il colore del marcatore
        Es: Grave -> Marcatore rosso  */
        public prioritaRichiesta: number,
        /* Determina lo stato della richiesta */
        public stato: string
    ) {
    }
}
