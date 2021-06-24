import { StatoSquadra } from '../enum/stato-squadra.enum';
import { StatoMezzo } from '../enum/stato-mezzo.enum';
import { SquadraComposizione } from '../interface/squadra-composizione-interface';

export function squadraComposizioneBusy(stato: StatoSquadra): boolean {
    switch (stato) {
        case StatoSquadra.SulPosto:
            return true;
        case StatoSquadra.InViaggio:
            return true;
        case StatoSquadra.InRientro:
            return true;
        default:
            return false;
    }
}

export function mezzoComposizioneBusy(stato: StatoMezzo): boolean {
    switch (stato) {
        case StatoMezzo.SulPosto:
            return true;
        case StatoMezzo.InUscita:
            return true;
        case StatoMezzo.InViaggio:
            return true;
        case StatoMezzo.Istituto:
            return true;
        case StatoMezzo.Occupato:
            return true;
        case StatoMezzo.InRientro:
            return true;
        default:
            return false;
    }
}

export function checkSquadraOccupata(squadreComposizione: SquadraComposizione[]): boolean {
    for (const squadra of squadreComposizione) {
        if (squadraComposizioneBusy(squadra.stato)) {
            return true;
        }
    }
    return false;
}

export function iconaStatiClass(stato: string): string {
    let returnClass = '';
    switch (stato) {
        case StatoMezzo.InSede:
            returnClass = 'text-success';
            break;
        case StatoMezzo.Rientrato:
            returnClass = 'text-success';
            break;
        case StatoMezzo.InUscita:
            returnClass = 'text-secondary';
            break;
        case StatoMezzo.InViaggio:
            returnClass = 'text-danger';
            break;
        case StatoMezzo.InRientro:
            returnClass = 'text-success';
            break;
        case StatoMezzo.SulPosto:
            returnClass = 'text-danger';
            break;

        default:
            break;
    }
    return returnClass;
}

export function boxStatiClass(stato: string): string {
  let returnClass = '';
  switch (stato) {
    case StatoMezzo.InSede:
      returnClass = 'badge-success';
      break;
    case StatoMezzo.Rientrato:
      returnClass = 'badge-success';
      break;
    case StatoMezzo.InUscita:
      returnClass = 'badge-secondary';
      break;
    case StatoMezzo.InViaggio:
      returnClass = 'badge-danger';
      break;
    case StatoMezzo.InRientro:
      returnClass = 'badge-success';
      break;
    case StatoMezzo.SulPosto:
      returnClass = 'badge-danger';
      break;

    default: returnClass = 'badge-dark';
             break;
  }
  return returnClass;
}

export function boxStatiSquadraClass(stato: number): string {
  let returnClass = '';
  switch (stato) {
    case StatoSquadra.InSede:
      returnClass = 'box-stato bg-success';
      break;
    case StatoSquadra.InViaggio:
      returnClass = 'box-stato bg-warning';
      break;
    case StatoSquadra.InRientro:
      returnClass = 'box-stato bg-verdemela';
      break;
    case StatoSquadra.SulPosto:
      returnClass = 'box-stato bg-danger';
      break;
    default: returnClass = 'box-stato bg-dark';
             break;
  }
  return returnClass;
}

export function nomeStatiSquadra(stato: number): string {
  let returnClass = '';
  switch (stato) {
    case 0:
      returnClass = 'In Sede';
      break;
    case 1:
      returnClass = 'In Rientro';
      break;
    case 2:
      returnClass = 'In Viaggio';
      break;
    case 3:
      returnClass = 'Sul Posto';
      break;
    default: returnClass = 'Occupato';
             break;
  }
  return returnClass;
}



export function codDistaccamentoIsEqual(codDistaccamentoSquadra: string, codDistaccamentoMezzo: string): boolean {
    return codDistaccamentoSquadra === codDistaccamentoMezzo;
}

export function calcolaTimeout(addBoxPartenza: boolean): number {
    let timeout = 0;
    if (!addBoxPartenza) {
        timeout = 0;
    } else {
        timeout = 10;
    }
    return timeout;
}

