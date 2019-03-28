import {Localita} from '../../../../shared/model/localita.model';

export class ChiamataMarker {
    constructor(
        /**
         * id
         */
        public id: string,
        /**
         * descrizione Operatore della chiamata
         */
        public descrizioneOperatore: string,
        /**
         * La stringa dell'indirizzo e le relative coordinate
         */
        public localita: Localita,
        /**
         * Contiene la descrizione della label da mostrare
         */
        public label?: string,
        /**
         * indica se il marker è creato dallo stesso utente che lo visualizza
         */
        public mySelf?: boolean,
    ) {
    }

}
