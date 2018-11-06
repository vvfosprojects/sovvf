import {Squadra} from '../../shared/model/squadra.model';
import {Mezzo} from '../../shared/model/mezzo.model';
import {Coordinate} from '../../shared/model/coordinate.model';

export class MezzoMarker {
    constructor(
        /**
         * La stringa dell'indirizzo e le relative coordinate
         */
        public coordinate: Coordinate,
        /**
         * Contiene le proprietà del mezzo
         */
        public mezzo: Mezzo,
        /**
         * id della richiesta a cui è associato il mezzo
         */
        public id_richiesta?: string,
        /**
         * Contiene la descrizione della label da mostrare
         */
        public label?: string,
    /**
     * Determina se il marcatore è opaco o meno
     */
    public opacita?: boolean
    ) {
    }

}
