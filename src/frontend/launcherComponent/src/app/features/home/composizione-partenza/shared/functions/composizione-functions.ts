import { StatoSquadra } from '../../../../../shared/enum/stato-squadra.enum';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';

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

export function checkSquadraOccupata(squadreComposizione: SquadraComposizione[]): boolean {
    for (const squadra of squadreComposizione) {
        if (squadraComposizioneBusy(squadra.squadra.stato)) {
            return true;
        }
    }
    return false;
}

export function iconaStatiClass(stato: string): string {
    let returnClass = '';

    switch (stato) {
        case 'In Sede':
            returnClass = 'text-success';
            break;
        case 'In Viaggio':
            returnClass = 'text-warning';
            break;
        case 'In Rientro':
            returnClass = 'text-verdemela';
            break;
        case 'Sul Posto':
            returnClass = 'text-danger';
            break;

        default:
            break;
    }
    return returnClass;
}
