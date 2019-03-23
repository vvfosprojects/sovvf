import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Mezzo } from '../../../../shared/model/mezzo.model';
import {Tipologia} from '../../../../shared/model/tipologia.model';

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
         * tipologia della richiesta a cui è associato il mezzo
         */
        public tipologie_richiesta?: Tipologia[],
        /**
         * Contiene la descrizione della label da mostrare
         */
        public label?: string
    ) {
    }

}
