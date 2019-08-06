import { StatoSquadra } from '../../../../../shared/enum/stato-squadra.enum';

export function squadraComposizioneBusy(stato: StatoSquadra) {
    switch (stato) {
        case StatoSquadra.SulPosto:
            return true;
        case StatoSquadra.InViaggio:
            return true;
        default:
            return false;
    }
}
