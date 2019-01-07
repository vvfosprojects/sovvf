import { MezzoComposizione } from './mezzo-composizione-interface';
import { SquadraComposizione } from './squadra-composizione-interface';

export interface BoxPartenza {
    id: string;
    mezzo?: MezzoComposizione;
    squadra: SquadraComposizione[];
    selezionato: boolean;
    hover: boolean;
}
