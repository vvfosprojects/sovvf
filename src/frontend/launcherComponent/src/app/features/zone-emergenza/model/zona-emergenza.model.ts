import { Localita } from '../../../shared/model/localita.model';
import { ModuloColonnaMobile } from '../interface/modulo-colonna-mobile.interface';
import { Cra } from '../interface/cra.interface';

export class ZonaEmergenza {

    constructor(
        /**
         * id
         */
        public id: string,
        /**
         * E' il codice della zona emergenza
         */
        public codEmergenza: string,
        /**
         * E' il codice del comando richiedente
         */
        public codComandoRichiedente: string,
        /**
         * Descrizione della Zona Emergenza
         */
        public descrizione: string,
        /**
         * Descrizione di cloui che ha preso in carico la gestione della Zona Emergenza
         */
        public tipologia: TipologiaEmergenza,
        /**
         * Descrizione della località della Zona Emergenza
         */
        public localita: Localita,
        /**
         * Eventi Zona Emergenza
         */
        public listaEventi?: EventoEmergenza[],
        /**
         * Definisce se la Zona Emergenza è stata annullata
         */
        public annullata?: boolean,
        /**
         * Definisce se la Zona Emergenza è stata allertata al CON
         */
        public allertata?: boolean,
        /**
         * Dirigenti assegnati dalla Direzione Regionale quando viene allertato il CON
         */
        public dirigenti?: string[],
        /**
         * Moduli "mob_Immediata" assegnati alla Zona Emergenza
         */
        public listaModuliImmediata?: ModuloColonnaMobile[],
        /**
         * Moduli "mob_Consolidamento" assegnati alla Zona Emergenza
         */
        public listaModuliConsolidamento?: ModuloColonnaMobile[],
        /**
         * Moduli "mob_Pot_Int" assegnati alla Zona Emergenza
         */
        public listaModuliPotInt?: ModuloColonnaMobile[],
        /**
         * Sedi di Emergenza
         */
        public cra?: Cra
    ) {
    }
}

export class TipologiaEmergenza {
    constructor(
        public id: string,
        public emergenza: string[],
        public moduli: ModuliColonnaMobile
    ) {
    }
}

export class ModuliColonnaMobile {
    constructor(
        // tslint:disable-next-line:variable-name
        public mob_Immediata: string[],
        // tslint:disable-next-line:variable-name
        public mob_Pot_Int: string[],
        // tslint:disable-next-line:variable-name
        public mob_Consolidamento: string[]
    ) {
    }
}

export class EventoEmergenza {
    constructor(
        public codiceFonte: string,
        public codiceRichiesta: string,
        public dataOraInserimento: string,
        public istante: string,
        public sedeOperatore: string,
        public tipoEvento: string,
        public tipologiaEmergenza: string,
        public tipologiaModuli: string[],
        public gestita: boolean
    ) {
    }
}
