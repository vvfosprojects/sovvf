import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Mezzo } from '../../../../shared/model/mezzo.model';
import { InfoRichiesta } from '../../../../shared/interface/info-richiesta.interface';

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
         * contiene le info della richiesta sulla quale è assegnato il mezzo
         */
        public infoRichiesta?: InfoRichiesta
    ) {
    }

}
