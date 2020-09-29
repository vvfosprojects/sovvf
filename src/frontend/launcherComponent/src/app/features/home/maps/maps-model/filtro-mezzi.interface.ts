import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';

export interface FiltroMezzi {
    filtraPerAreaMappa?: boolean;
    tipologia?: string[];
    stato?: StatoMezzo[];
}
