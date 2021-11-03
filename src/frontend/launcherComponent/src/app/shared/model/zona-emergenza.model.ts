import { Localita } from './localita.model';
import { EventoRichiesta } from './evento-richiesta.model';

export class ZonaEmergenza {

    constructor(
        /**
         * id
         */
        public id: string,
        /**
         * E' il codice della zona emergenza
         */
        public codiceEmergenza: string,
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
         * Descrizione di cloui/coloro che ha/hanno preso in carico la Zona Emergenza
         */
        public presaInCarico: PresaInCaricoEmergenza[],
        /**
         * Descrizione della località della Zona Emergenza
         */
        public localita: Localita,
        /**
         * Eventi Zona Emergenza
         */
        public listaEventi?: EventoRichiesta[],
        /**
         * Definisce se la Zona Emergenza è stata annullata
         */
        public annullata?: boolean
    ) {
    }
}

export enum TipologiaEmergenza {
    'Terremoto',
    'Alluvione'
}

export enum PresaInCaricoEmergenza {
    'CON',
    'DirezioneRegionale'
}
