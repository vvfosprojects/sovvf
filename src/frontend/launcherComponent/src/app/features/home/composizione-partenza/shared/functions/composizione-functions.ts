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

export function mezzoComposizioneBusy(stato: string) {
    switch (stato) {
        case 'Sul Posto':
            return true;
        case 'In Viaggio':
            return true;
        case 'Istituto':
            return true;
        default:
            return false;
    }
}
