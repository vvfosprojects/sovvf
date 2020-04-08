import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';

export interface FiltroMezzi {
    tipologia?: string[];
    stato?: StatoMezzo[];
}
