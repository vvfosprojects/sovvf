import { MezzoComposizione } from './mezzo-composizione-interface';
import { Squadra } from 'src/app/shared/model/squadra.model';

export interface BoxPartenza {
    id: string;
    mezzo?: MezzoComposizione;
    squadra: Squadra[];
    selezionato: boolean;
    hover: boolean;
}
