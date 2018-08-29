import {Marker} from './marker.model';
import {Squadra} from '../../shared/model/squadra.model';
import {DescrizioneLocalita} from '../../shared/model/descrizione-localita.model';
import {IconMarker} from '../../shared/model/icon-marker.model';

export class MezzoMarker implements Marker {
    constructor(
        /* Codice del mezzo */
        public codice: number,
        /* id della richiesta a cui è associato il mezzo */
        public id_richiesta: number,
        /* La stringa dell'indirizzo e le relative coordinate */
        public localita: DescrizioneLocalita,
        /* Le squadre presenti sul mezzo */
        public squadre: Squadra[],
        /* Contiene la descrizione della label da mostrare */
        public label: string
    ) {
    }
}
