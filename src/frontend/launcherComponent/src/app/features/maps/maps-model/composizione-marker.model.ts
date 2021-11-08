import { Localita } from '../../../shared/model/localita.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { StatoRichiesta } from '../../../shared/enum/stato-richiesta.enum';

export class ComposizioneMarker {
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
         * Id del tipo tipologia
         */
        public tipologia: Tipologia[],
        /**
         * Contiene la descrizione della label da mostrare
         */
        public label: string,
        /**
         * Determina la priorità del marcatore per scegliere il colore del marcatore
         * Es: Grave -> Marcatore rosso
         */
        public priorita: number,
        /**
         * Determina lo stato della richiesta
         */
        public stato: StatoRichiesta,
        /**
         * Determina la rilevanza del marcatore
         */
        public rilevanza?: boolean,
        /**
         * Determina se il marcatore è opaco o meno
         */
        public opacita?: boolean) {
    }
}
