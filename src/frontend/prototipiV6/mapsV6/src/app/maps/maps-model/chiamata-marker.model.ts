import {Localita} from '../../shared/model/localita.model';

export class ChiamataMarker {
    constructor(
        /**
         * id
         */
        public id: string,
        /**
         * La stringa dell'indirizzo e le relative coordinate
         */
        public localita: Localita,
        /**
         * Contiene la descrizione della label da mostrare
         */
        public label?: string,
    ) {
    }

}
