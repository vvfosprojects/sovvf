import {Tipologia} from './tipologia.model';
import {Sede} from './sede.model';
import {Localita} from './localita.model';
import {Richiedente} from './richiedente.model';
import {Fonogramma} from './fonogramma.model';
import {Complessita} from './complessita.model';
import { Partenza } from './partenza.model';
import { Operatore } from './operatore.model';
import {Evento} from './evento.model';

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

        public operatore: Operatore,
        /**
         * Indica se la richiesta è rilevante
         */
        public rilevanza: boolean,
        /**
         * ricezione della richiesta (via telefono, ecc.)
         */
        public istanteRicezioneRichiesta: Date,
        /**
         * eventuale istante di prima assegnazione di risorse alla richiesta
         */
        public istantePrimaAssegnazione: Date,
        /**
         * Indica lo stato della richiesa di soccorso
         */
        public stato: string,
        /**
         * priorita della richiesta (da 0 a 4). 0 = Altissima, 1 = Alta, 2 = Media,
         * 3 = Bassa, 4 = Bassissima.
         */
        public priorita: number,
        /**
         * descrizione delle tipologie
         */
        public tipologie: Tipologia[],
        /**
         * descrizione della richiesta
         */
        public descrizione: string,
        /**
         * descrizione del richiedente
         */
        public richiedente: Richiedente,
        /**
         * descrizione della località dell'evento
         */
        public localita: Localita,
        /**
         * descrizione delle sedi di prima, seconda e terza competenza
         */
        public competenze: Sede[],
        /**
         * descrizione delle zone di emergenza
         */
        public zoneEmergenza: string[],
        /**
         * eventuale istante di presa in carico della richiesta
         */
        public istantePresaInCarico: Date,
        /**
         * codice della scheda NUE
         */
        public codiceSchedaNue: string,
        /**
         * codice dello stato di invio del fonogramma (0 = Non necessario, 1 = Da inviare,
         * 2 = Inviato). Utile a calcolare il colore della segnalazione.
         */
        public fonogramma: Fonogramma,
        /**
         * indice di complessità dell'intervento (per es. numero di eventi collegati alla richiesta)
         */
        public complessita: Complessita,
        /**
         * lista delle partenze
         */
        public partenze: Partenza[],
        /**
         * etichette associate all'intervento (per es. aPagamento, imp, ecc.)
         */
        public etichette: string[],
        /**
         * lista degli eventi associati all'intervento
         */
        public eventi: Evento[]
    ) {
    }
}
