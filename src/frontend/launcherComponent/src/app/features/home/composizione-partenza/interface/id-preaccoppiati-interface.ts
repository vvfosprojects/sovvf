import {MezzoComposizione} from '../../../../shared/interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';

export interface IdPreaccoppiati {
    id: string;
    codiceSede: string;
    mezzo: string;
    squadre: string[];
}

export interface DatiPreaccoppiati {
  id: string;
  codiceSede: string;
  mezzo: MezzoComposizione;
  squadre: SquadraComposizione[];
}
