import {Localita} from '../../shared/model/localita.model';

export class MeteoMarker {
    constructor(
        /**
         * id
         */
        public id: string,
        /**
         * La stringa dell'indirizzo e le relative coordinate
         */
        public localita: Localita,
    ) {
    }

}
