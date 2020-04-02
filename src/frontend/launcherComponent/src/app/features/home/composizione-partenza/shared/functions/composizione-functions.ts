import { StatoSquadra } from '../../../../../shared/enum/stato-squadra.enum';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';

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

export function mezzoComposizioneBusy(stato: StatoMezzo) {
    switch (stato) {
        case StatoMezzo.SulPosto:
            return true;
        case StatoMezzo.InViaggio:
            return true;
        case StatoMezzo.Istituto:
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
        case StatoMezzo.InViaggio:
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

export function codDistaccamentoIsEqual(codDistaccamentoSquadra: string, codDistaccamentoMezzo: string) {
    return codDistaccamentoSquadra === codDistaccamentoMezzo;
}
