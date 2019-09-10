import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Mezzo } from '../../../../shared/model/mezzo.model';

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
    ) {
    }

}
