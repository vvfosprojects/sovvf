import { MezzoComposizione } from './mezzo-composizione-interface';
import { StatoSquadra } from '../enum/stato-squadra.enum';
import { Sede } from '../model/sede.model';
import { Componente } from '../model/componente.model';

export interface SquadraComposizione {
    id: string;
    diEmergenza: boolean;
    nome: string;
    stato: StatoSquadra;
    componenti: Componente[];
    distaccamento: Sede;
    turno: string;
    mezziPreaccoppiati: MezzoPreaccoppiato[];
    listaMezzi?: MezzoComposizione[];
}

export interface MezzoPreaccoppiato {
    codice: string;
    descrizione: string;
    genere: string;
    stato: string;
}
