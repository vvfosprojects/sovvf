import { MezzoComposizione } from '../../features/home/composizione-partenza/interface/mezzo-composizione-interface';

export interface MezzoPrenotatoInterface {
    mezzoPrenotato: {
        idMezzoComposizione?: string;
        idRichiesta?: string;
        mezzo?: MezzoComposizione;
    }
}
