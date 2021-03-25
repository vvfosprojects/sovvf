import { StatoMezzo } from '../enum/stato-mezzo.enum';
import { StatoMezzoActions } from '../enum/stato-mezzo-actions.enum';

export function calcolaActionSuggeritaMezzo(stato: StatoMezzo): StatoMezzoActions {
    let actionMezzoSuggerita: StatoMezzoActions;
    switch (stato) {
        case StatoMezzo.InUscita:
            actionMezzoSuggerita = StatoMezzoActions.InViaggio;
            break;
        case StatoMezzo.InViaggio:
            actionMezzoSuggerita = StatoMezzoActions.SulPosto;
            break;
        case StatoMezzo.SulPosto:
            actionMezzoSuggerita = StatoMezzoActions.InRientro;
            break;
        case StatoMezzo.InRientro:
            actionMezzoSuggerita = StatoMezzoActions.Rientrato;
            break;
        case StatoMezzo.InSede:
            actionMezzoSuggerita = StatoMezzoActions.InViaggio;
            break;
        case StatoMezzo.Rientrato:
            actionMezzoSuggerita = StatoMezzoActions.InViaggio;
            break;
    }
    return actionMezzoSuggerita;
}

export function statoMezzoActionsEnumToStringArray(exceptStato?: string[]): string[] {
    let mezzoActionsString = [];
    for (const mezzoAction in StatoMezzoActions) {
        if (typeof StatoMezzoActions[mezzoAction] === 'string') {
            mezzoActionsString.push(StatoMezzoActions[mezzoAction]);
        }
    }
    // se c'è un'eccezione filtro l'array eliminando lo stato
    if (exceptStato && exceptStato.length > 0) {
        exceptStato.forEach((stato: string) => {
            mezzoActionsString = mezzoActionsString.filter((s: string) => s !== stato);
        });
    }
    return mezzoActionsString;
}

export function statoMezzoColor(stato: StatoMezzo): string {
    let mezzoColor = '';
    switch (stato) {
        case StatoMezzo.InSede:
            mezzoColor = 'success';
            break;
        case StatoMezzo.Rientrato:
            mezzoColor = 'success';
            break;
        case StatoMezzo.InUscita:
            mezzoColor = 'secondary';
            break;
        case StatoMezzo.InViaggio:
            mezzoColor = 'danger';
            break;
        case StatoMezzo.SulPosto:
            mezzoColor = 'danger';
            break;
        case StatoMezzo.InRientro:
            mezzoColor = 'success';
            break;
        case StatoMezzo.Istituto:
            mezzoColor = 'secondary';
            break;
    }
    return mezzoColor;
}

export function statoMezzoActionColor(stato: StatoMezzoActions): string {
    let mezzoActionColor = '';
    switch (stato) {
        case StatoMezzoActions.Rientrato:
            mezzoActionColor = 'success';
            break;
        case StatoMezzoActions.InUscita:
            mezzoActionColor = 'secondary';
            break;
        case StatoMezzoActions.InViaggio:
            mezzoActionColor = 'warning';
            break;
        case StatoMezzoActions.SulPosto:
            mezzoActionColor = 'danger';
            break;
        case StatoMezzoActions.InRientro:
            mezzoActionColor = 'verdemela';
            break;
    }
    return mezzoActionColor;
}

export function statoMezzoBorderClass(stato: StatoMezzo): string {
    let borderClass = '';
    switch (stato) {
        case StatoMezzo.InSede:
            borderClass = 'status_border_inSede';
            break;
        case StatoMezzo.Rientrato:
            borderClass = 'status_border_inSede';
            break;
        case StatoMezzo.InUscita:
            borderClass = 'status_border_inUscita';
            break;
        case StatoMezzo.InViaggio:
            borderClass = 'status_border_inViaggio';
            break;
        case StatoMezzo.SulPosto:
            borderClass = 'status_border_sulPosto';
            break;
        case StatoMezzo.InRientro:
            borderClass = 'status_border_inRientro';
            break;
        case StatoMezzo.Istituto:
            borderClass = 'status_border_istituto';
            break;
    }
    return borderClass;
}
