import { Mezzo } from './mezzo.model';
import { Squadra } from './squadra.model';
import { TurnoPartenza } from './turno-partenza';
import { Coordinate } from './coordinate.model';

export class Partenza {
    constructor(
        public partenza: DettaglioPartenza,
        public codiceMezzo: string,
        public codiceRichiesta: string,
        public istante: string,
        public codicePartenza: string,
        public fuoriSede: boolean,
        public inviataStatri: boolean,
        public coordinate: Coordinate,
        public squadre?: Squadra[],
        public mezzo?: Mezzo
    ) {
    }
}

export class DettaglioPartenza {
    constructor(
        public id: string,
        public squadre: Squadra[],
        public mezzo: Mezzo,
        public turno: TurnoPartenza,
        public sganciata: boolean,
        public partenzaAnnullata: boolean,
        public terminata: boolean,
        public codicePartenza: string,
        public coordinate: { latitudine: string, longitudine: string }
    ) {
    }
}
