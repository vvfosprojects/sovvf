import { Squadra } from "app/sintesi-richiesta/squadra.model";
import { Mezzo } from "../mezzo/mezzo.model";
import { Componente } from "../componente/componente.model";

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
         * E' il codice della Richiesta di Assistenza
         */
        public codice: string,

        /**
         * Indica se la richiesta è rilevante
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
         * Indica se il luogo del sinistro è presidiato con squadra VVF
         */
        public presidiato: boolean,

        /**
         * priorita della richiesta (da 0 a 4). 0 = Altissima, 1 = Alta, 2 = Media,
         * 3 = Bassa, 4 = Bassissima.
         */
        public prioritaRichiesta: number,

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
         * descrizione della località dell'evento
         */
        public descrizioneLocalita: string,

        /**
         * descrizione delle sedi di prima, seconda e terza competenza
         */
        public descrizioneCompetenze: string[],

        /**
         * note sulla località della richiesta (per es. "accanto a ingresso
         * carico/scarico del supermercato Spendibene")
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
         * codice dello stato di invio del fonogramma (0 = Non necessario, 1 = Da inviare,
         * 2 = Inviato). Utile a calcolare il colore della segnalazione.
         */
        public statoFonogrammaRichiesta: number,

        /**
         * segnalazione sullo stato di invio del fonogramma
         */
        public descrizioneStatoFonogramma: string,

        /**
         * indice di complessità dell'intervento (per es. numero di eventi collegati alla richiesta)
         */
        public indiceComplessita: number,

        /**
         * codice della complessità dell'intervento (0 = Alta, 1 = Media, 2 = Bassa). Utile
         * a calcolare il colore della segnalazione sulla complessità.
         */
        public complessitaRichiesta: number,

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

    public tuttiIComponenti(): Componente[] {
        return this.squadre.reduce((a, c) => {
            a.push(...c.componenti);

            return a;
        }, []);
    }
}
