import { Tipologia } from './tipologia.model';
import { Sede } from './sede.model';
import { Localita } from './localita.model';
import { Richiedente } from './richiedente.model';
import { Fonogramma } from './fonogramma.model';
import { Complessita } from './complessita.model';
import { Utente } from './utente.model';
import { StatoRichiesta } from '../enum/stato-richiesta.enum';
import { Partenza } from './partenza.model';
import { AzioneChiamataEnum } from '../enum/azione-chiamata.enum';
import { TipoTerreno } from './tipo-terreno';
import { TurnoIntervento } from './turno-intervento';
import { ObiettivoSensibile } from './obiettivo-sensibile';
import { AttivitaUtente } from './attivita-utente.model';
import { EnteInterface } from '../interface/ente.interface';
import { TriageSummary } from '../interface/triage-summary.interface';
import { DettaglioTipologia } from '../interface/dettaglio-tipologia.interface';

/**
 * Modella la sintesi della richiesta di assistenza, con tutti i dati necessari
 * ad alimentare il primo ed il secondo livello di zoom. Non include il dettaglio
 * degli eventi-richiesta-richiesta della richiesta.
 */
export class SintesiRichiesta {

    constructor(
        /**
         * id
         */
        public id: string,
        /**
         * E' il codice della chiamata
         */
        public codice: string,
        /**
         * E' il codice della richiesta
         */
        public codiceRichiesta: string,
        /**
         * è l'operatore che inserisce la richiesta
         */
        public operatore: Utente,
        /**
         * ricezione della richiesta (via telefono, ecc.)
         */
        public istanteRicezioneRichiesta: Date,
        /**
         * Indica lo stato della richiesta di soccorso
         */
        public stato: StatoRichiesta,
        /**
         * prioritaRichiesta della richiesta (da 0 a 4). 0 = Altissima, 1 = Alta, 2 = Media,
         * 3 = Bassa, 4 = Bassissima.
         */
        public prioritaRichiesta: Priorita,
        /**
         * descrizione delle tipologie
         */
        public tipologie: Tipologia[],
        /**
         * dettaglio della tipologia
         */
        public dettaglioTipologia: DettaglioTipologia,
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
         * codici delle sedi di prima, seconda e terza competenza
         */
        public codCompetenze: string[],
        /**
         * indice di complessità dell'intervento (per es. numero di eventi-richiesta-richiesta collegati alla richiesta)
         */
        public complessita: Complessita,
        /**
         * eventuale istante di presa in carico della richiesta
         */
        public istantePresaInCarico?: Date,
        /**
         * eventuale istante di prima assegnazione di risorse alla richiesta
         */
        public istantePrimaAssegnazione?: Date,
        /**
         * Indica se la richiesta è rilevante
         */
        public rilevanteGrave?: boolean,
        /**
         * codice della scheda NUE
         */
        public codiceSchedaNue?: string,
        /**
         * descrizione delle zone di emergenza
         */
        public zoneEmergenza?: string[],
        /**
         * codice dello stato di invio del fonogramma (0 = Non necessario, 1 = Da inviare,
         * 2 = Inviato). Utile a calcolare il colore della segnalazione.
         */
        public fonogramma?: Fonogramma,
        /**
         * lista delle partenze
         */
        public partenze?: Partenza[],
        /**
         * etichette associate all'intervento (per es. aPagamento, imp, ecc.)
         */
        public tags?: string[],
        /**
         * note pubbliche
         */
        public notePubbliche?: string,
        /**
         * note private
         */
        public notePrivate?: string,
        /**
         * azione della richiesta
         */
        public azione?: AzioneChiamataEnum,
        /**
         * turno inserimento della chiamata
         */
        public trnInsChiamata?: string,
        /**
         * turno dell'intervento
         */
        public turnoIntervento?: TurnoIntervento,
        /**
         * tipo terreno
         */
        public tipoTerreno?: TipoTerreno[],
        /**
         * lista codici Enti intervenuti
         */
        public codEntiIntervenuti?: number[],
        /**
         * lista enti presa in carico
         */
        public listaEntiPresaInCarico?: EnteInterface[],
        /**
         * obiettivo sensibile
         */
        public obiettivoSensibile?: ObiettivoSensibile,
        /**
         * rilevanza Storica Artistica e Culturale
         */
        public rilevanteStArCu?: boolean,
        /**
         * motivazione della chiusura
         */
        public motivazione?: string,
        /**
         * lista di prese in carico utente
         */
        public listaUtentiPresaInCarico?: AttivitaUtente[],
        /**
         * codici UO di competenza
         */
        public codUOCompetenza?: string[],
        /**
         * codici SO allertate
         */
        public codSOAllertate?: string[],
        /**
         * codici Sedi Allertate
         */
        public sediAllertate?: Sede[],
        /**
         * codice SO competente
         */
        public codSOCompetente?: string,
        /**
         * richiesta inviata in stato di emergenza
         */
        public chiamataUrgente?: boolean,
        /**
         * richiesta creata per esercitazione
         */
        public esercitazione?: boolean,
        /**
         * resoconto triage
         */
        public triageSummary?: TriageSummary[],
        /**
         * Info Note NUE
         */
        public noteNue?: string,
        /**
         * eventi richiesta relativi a mezzi e velivoli
         */
        public eventi?: any
    ) {
    }
}

export enum Priorita {
    Bassissima = 1,
    Bassa,
    Media,
    Alta,
    Altissima
}
