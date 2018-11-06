import { Sede } from '../shared/model/sede.model';
import { Turno } from './turno/turno.model';
import { Operatore } from '../shared/model/operatore.model';

/**
 * da togliere tutto il model perchè non serve
 */
export class Navbar {
    constructor(
        /**
         * l'operatore loggato
         */
        public operatore: Operatore,
        /**
         * turnazione
         */
        public turnazione: Turno,
        /**
         * la lista delle unità operative
         */
        public unitaOperative: Sede[]
    ) {
    }
}
