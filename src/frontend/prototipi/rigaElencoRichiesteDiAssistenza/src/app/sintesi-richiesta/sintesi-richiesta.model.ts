import { Squadra } from "app/sintesi-richiesta/squadra.model";
import { Mezzo } from "app/sintesi-richiesta/mezzo.model";

/**
 * Modella la sintesi della richiesta di assistenza, con tutti i dati necessari
 * ad alimentare il primo ed il secondo livello di zoom. Non include il dettaglio
 * degli eventi della richiesta.
 */
export class SintesiRichiesta {
    constructor(
        /**
         * id
         */
        public id: string,

        /**
         * codice
         */
        public codice: string,

        /**
         * indica se la richiesta è stata marcata come rilevante dall'operatore
         */
        public rilevante: boolean,

        /**
         * ricezione della richiesta (via telefono, ecc.)
         */
        public istanteRicezioneRichiesta: Date,

        /**
         * eventuale istante di prima assegnazione di risorse alla richiesta
         */
        public istantePrimaAssegnazione: Date,

        /**
         * priorita della richiesta (da 1 a 5). 1 = Altissima, 2 = Alta, 3 = Media,
         * 4 = Bassa, 5 = Bassissima.
         */
        public priorita: number,

        /**
         * descrizione delle tipologie
         */
        public tipologie: string[],

        /**
         * descrizione della richiesta
         */
        public descrizione: string,

        /**
         * descrizione del richiedente
         */
        public richiedente: string,

        /**
         * numero telefonico del richiedente (se appropriato)
         */
        public numeroRichiedente: string,

        /**
         * descrizione della località della richiesta
         */
        public descrizioneLocalita: string,

        /**
         * descrizione delle sedi di prima, seconda e terza competenza
         */
        public descrizioneCompetenze: string[],

        /**
         * note sulla località della richiesta (per es. "accanto a ingresso carico/scarico del supermercato Spendibene")
         */
        public noteLocalita: string,

        /**
         * descrizione delle zone di emergenza
         */
        public zoneEmergenza: string[],

        /**
         * eventuale istante di presa in carico della richiesta
         */
        public istantePresaInCarico: Date,

        /**
         * codice della scheda nue
         */
        public codiceSchedaNue: string,

        /**
         * codice dello stato di invio del fonogramma (per es. daInviare, inviato, nonNecessario). Utile a calcolare
         * il colore della segnalazione.
         */
        public codiceStatoFonogramma: string,

        /**
         * segnalazione sullo stato di invio del fonogramma.
         */
        public descrizioneStatoFonogramma: string,

        /**
         * numero di eventi collegati alla richiesta (che è un'indicazione di massima
         * sulla stima della complessità dell'intervento)
         */
        public numeroEventiGenerati: number,

        /**
         * codice della complessità dell'intervento (per es. bassa, media, alta). Utile
         * a calcolare il colore della segnalazione sulla complessità.
         */
        public codiceComplessita: string,

        /**
         * segnalazione sulla complessità dell'intervento.
         */
        public descrizioneComplessita: string,

        /**
         * dati sulle squadre coinvolte nella richiesta
         */
        public squadre: Squadra[],

        /**
         * dati sui mezzi impegnati sull'intervento
         */
        public mezzi: Mezzo[],

        /**
         * etichette associate all'intervento (per es. aPagamento, imp, ecc.)
         */
        public etichette: string[]
    ) {}
}
