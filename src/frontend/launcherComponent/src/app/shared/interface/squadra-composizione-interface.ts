import { Squadra } from 'src/app/shared/model/squadra.model';
import { MezzoComposizione } from './mezzo-composizione-interface';

export interface SquadraComposizione {
    id: string;
    squadra: Squadra;
    mezzoPreaccoppiato?: MezzoComposizione;
    listaMezzi?: MezzoComposizione[];
}
