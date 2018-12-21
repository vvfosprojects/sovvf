import { Squadra } from './squadra.model';
import { Sede } from './sede.model';
/**
 * Modella un mezzo impegnato su una richiesta di assistenza
 */
export class Mezzo {
    constructor(
        /**
         * Codice
         */
        public codice: string,
        /**
         * Descrizione del mezzo (come appare in GUI)
         */
        public descrizione: string,
        /**
         * Genere. Per es. APS, ABP, AS, CA, ecc.
         */
        public genere: string,
        /**
         * Codice dello stato del mezzo (InSede, InViaggio, SulPosto,
         * InRientro, Istituto). Utile a definire il colore del segnale di stato.
         */
        public stato: string,
        /**
         * Codice dello stato di appartenenza del mezzo (0 = Proprio, 1 = Altra sede).
         * Utile a definire il colore della segnalazione sullo stato di appartenenza.
         */
        public appartenenza: number,
        /**
        * Distaccamento di appartenza
        */
        public distaccamento: Sede,
        /**
         * Testo della segnalazione sullo stato di appartenenza.
         */
        public descrizioneAppartenenza?: string,
        /**
         * Testo del segnale di stato.
         */
        public descrizioneStato?: string,
        /**
         * Codice dello stato di efficienza del mezzo (0 = FuoriUso, 1 = Mediocre, 2 = Buono,
         * 3 = Ottimo). Utile a definire il colore della segnalazione dello stato di efficienza.
         */
        public statoEfficienza?: number,
        /**
         * Testo dello stato di efficienza
         */
        public descrizioneStatoEfficienza?: string,
        /**
         * Codice del livello di carburante (0 = NonRilevato, 1 = Vuoto, 2 = Basso, 3 = Medio,
         * 4 = Alto). Utile a definire il colore della segnalazione sul livello di carburante.
         */
        public livelloCarburante?: number,
        /**
         * Testo del livello di carburante.
         */
        public descrizioneLivelloCarburante?: string,
        /**
         * Codice del livello di estinguente (0 = NonRilevato, 1 = Vuoto, 2 = Basso, 3 = Medio,
         * 4 = Alto). Utile a definire il colore della segnalazione del livello di estinguente.
         */
        public livelloEstinguente?: number,
        /**
         * Testo della segnalazione sul livello di estinguente
         */
        public descrizioneLivelloEstinguente?: string,
        /**
         * Elenco delle notifiche legate al mezzo
         */
        public notifiche?: string[]
    ) {
    }
}
