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

export interface RichiestaForm {
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
    codCompetenzaCentrale?: string;
    codPrimaCompetenza?: string;
    codSecondaCompetenza?: string;
    codTerzaCompetenza?: string;
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
}
