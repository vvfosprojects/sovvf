import { MezzoComposizione } from '../../../../shared/interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';

export interface BoxPartenza {
    id: string;
    mezzoComposizione: MezzoComposizione;
    squadreComposizione: SquadraComposizione[];
}
