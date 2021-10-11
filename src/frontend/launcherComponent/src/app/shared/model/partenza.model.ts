import { Mezzo } from './mezzo.model';
import { Squadra } from './squadra.model';
import { TurnoPartenza } from './turno-partenza';

export class Partenza {
    constructor(
        public partenza?: DettaglioPartenza,
        public codiceFonte?: string,
        public codiceMezzo?: string,
        public codiceRichiesta?: string,
        public dataOraInserimento?: string,
        public istante?: string,
        public sedeOperatore?: string,
        public tipoEvento?: string,
        public codicePartenza?: number,
        public fuoriSede?: boolean,
    ) {
        }
}

export class DettaglioPartenza {
    constructor(
        public id: string,
        public squadre: Squadra[],
        public mezzo?: Mezzo,
        public turno?: TurnoPartenza,
        public sganciata?: boolean,
        public partenzaAnnullata?: boolean,
        public terminata?: boolean,
        public codice?: string
    ) {
    }
}
