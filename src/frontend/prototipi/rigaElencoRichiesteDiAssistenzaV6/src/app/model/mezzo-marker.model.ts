import { Marker } from "./marker.model";
import { Squadra } from "./squadra.model";
import { DescrizioneLocalita } from "./descrizione-localita.model";

export class MezzoMarker implements Marker {
    constructor(
        /* Codice del mezzo */
        public codice: number,

        /* id della richiesta a cui è associato il mezzo */
        public id_richiesta: number,

        /* La stringa dell'indirizzo e le relative coordinate */
        public indirizzo: DescrizioneLocalita,

        /* Le squadre presenti sul mezzo */
        public squadre: Squadra[],

        /* La classe dell'icona da visualizzare */
        public icon: string,
        
        /* Contiene la descrizione della label da mostrare */
        public label: string
    ) {
    }
}
