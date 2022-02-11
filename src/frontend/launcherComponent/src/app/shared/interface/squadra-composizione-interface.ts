import { MezzoComposizione } from './mezzo-composizione-interface';
import { StatoSquadra } from '../enum/stato-squadra.enum';
import { Sede } from '../model/sede.model';
import { Componente } from '../model/componente.model';

export interface SquadraComposizione {
    codice: string;
    diEmergenza: boolean;
    nome: string;
    stato: StatoSquadra;
    membri: Componente[];
    distaccamento: Sede;
    turno: string;
    mezziPreaccoppiati?: MezzoComposizione[];
    mezziInRientro?: MezzoComposizione[];
    idOpService?: string;
    spotId?: string;
    spotType?: string;
    workshiftId?: string;
    version?: number;
}

export interface Qualifica {
    name?: string;
    description?: string;
    group?: string;
}
