import { Utente } from '../../model/utente.model';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { DettaglioTipologia } from '../dettaglio-tipologia.interface';
import { Sede } from '../../model/sede.model';
import { Complessita } from '../../model/complessita.model';
import { TurnoIntervento } from '../../model/turno-intervento';
import { ObiettivoSensibile } from '../../model/obiettivo-sensibile';
import { EnteInterface } from '../ente.interface';
import { Fonogramma } from '../../model/fonogramma.model';
import { Partenza } from '../../model/partenza.model';
import { AttivitaUtente } from '../../model/attivita-utente.model';

export class RichiestaForm {
    id: string;
    codice: string;
    codiceRichiesta: string;
    operatore: Utente;
    istanteRicezioneRichiesta: Date;
    stato: StatoRichiesta;
    codTipologia: string;
    dettaglioTipologia: DettaglioTipologia;
    nominativo: string;
    telefono: string;
    competenze: Sede[];
    complessita: Complessita;
    istantePresaInCarico: Date;
    istantePrimaAssegnazione: Date;
    trnInsChiamata: string;
    turnoIntervento: TurnoIntervento;
    boschi: number;
    campi: number;
    sterpaglie: number;
    indirizzo: string;
    latitudine: number;
    longitudine: number;
    citta?: string;
    provincia: string;
    cap: string;
    regione: string;
    civico?: string;
    piano: string;
    palazzo: string;
    scala: string;
    interno: string;
    etichette: string[];
    noteIndirizzo: string;
    obiettivoSensibile: ObiettivoSensibile;
    rilevanzaGrave: boolean;
    rilevanzaStArCu: boolean;
    notePrivate: string;
    notePubbliche: string;
    descrizione: string;
    zoneEmergenza: string;
    prioritaRichiesta: number;
    codSchedaContatto: string;
    listaEntiPresaInCarico: EnteInterface[];
    urgenza: boolean;
    esercitazione: boolean;
    codSOCompetente: string;
    sediAllertate: Sede[];
    codSOAllertate: string[];
    fonogramma: Fonogramma;
    partenze: Partenza[];
    codEntiIntervenuti: number[];
    motivazione: string;
    listaUtentiPresaInCarico: AttivitaUtente[];
    codUOCompetenza: string[];
    noteNue: string;

    constructor() {
        this.id = null;
        this.codice = null;
        this.codiceRichiesta = null;
        this.operatore = null;
        this.istanteRicezioneRichiesta = null;
        this.stato = null;
        this.codTipologia = null;
        this.dettaglioTipologia = null;
        this.nominativo = null;
        this.telefono = null;
        this.complessita = null;
        this.istantePresaInCarico = null;
        this.istantePrimaAssegnazione = null;
        this.trnInsChiamata = null;
        this.turnoIntervento = null;
        this.boschi = null;
        this.campi = null;
        this.sterpaglie = null;
        this.indirizzo = null;
        this.latitudine = null;
        this.longitudine = null;
        this.provincia = null;
        this.cap = null;
        this.regione = null;
        this.civico = null;
        this.piano = null;
        this.palazzo = null;
        this.scala = null;
        this.interno = null;
        this.etichette = null;
        this.noteIndirizzo = null;
        this.obiettivoSensibile = null;
        this.rilevanzaGrave = null;
        this.rilevanzaStArCu = null;
        this.notePrivate = null;
        this.notePubbliche = null;
        this.descrizione = null;
        this.zoneEmergenza = null;
        this.prioritaRichiesta = 3;
        this.codSchedaContatto = null;
        this.listaEntiPresaInCarico = null;
        this.urgenza = null;
        this.esercitazione = null;
        this.codSOCompetente = null;
        this.sediAllertate = null;
        this.codSOAllertate = null;
        this.fonogramma = null;
        this.partenze = null;
        this.codEntiIntervenuti = null;
        this.motivazione = null;
        this.listaUtentiPresaInCarico = null;
        this.codUOCompetenza = null;
        this.noteNue = null;
    }
}
