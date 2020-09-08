import { MezzoComposizione } from './mezzo-composizione-interface';

export interface MezzoPrenotatoInterface {
    idMezzo?: string;
    idMezzoComposizione?: string;
    idRichiesta?: string;
    mezzoComposizione?: MezzoComposizione;
}
