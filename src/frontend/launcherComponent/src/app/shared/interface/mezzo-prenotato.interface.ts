import { MezzoComposizione } from '../../features/home/composizione-partenza/interface/mezzo-composizione-interface';

export interface MezzoPrenotatoInterface {
    idMezzo?: string;
    idMezzoComposizione?: string;
    idRichiesta?: string;
    mezzoComposizione?: MezzoComposizione;
}
