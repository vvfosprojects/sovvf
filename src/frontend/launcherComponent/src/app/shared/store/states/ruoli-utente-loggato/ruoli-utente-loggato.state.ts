import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    ClearRuoliUtenteLoggato,
    SetRuoliUtenteLoggato,
    UpdateRuoliUtenteLoggato
} from '../../actions/ruoli/ruoli.actions';
import { Ruolo } from '../../../model/utente.model';
import { NavbarState } from '../../../../features/navbar/store/states/navbar.state';
import { getRuoliRicorsivo } from '../../../helper/function-ruoli';
import { LSNAME } from '../../../../core/settings/config';
import { Injectable } from '@angular/core';

export interface RuoliUtenteLoggatoStateModel {
    ruoliPrincipali: Ruolo[];
    ruoli: Ruolo[];
}

export const ruoliStateModelDefaults: RuoliUtenteLoggatoStateModel = {
    ruoliPrincipali: [],
    ruoli: []
};

@Injectable()
@State<RuoliUtenteLoggatoStateModel>({
    name: 'ruoliUtenteLoggato',
    defaults: ruoliStateModelDefaults
})
export class RuoliUtenteLoggatoState {

    @Selector()
    static ruoliPrincipali(state: RuoliUtenteLoggatoStateModel): Ruolo[] {
        return state.ruoliPrincipali;
    }

    @Selector()
    static ruoli(state: RuoliUtenteLoggatoStateModel): Ruolo[] {
        return state.ruoli;
    }

    @Selector()
    static ruoliFiltrati(state: RuoliUtenteLoggatoStateModel): Ruolo[] {
        return state.ruoli.filter((r: Ruolo) => !r.hidden);
    }

    constructor(private store: Store) {
    }

    @Action(SetRuoliUtenteLoggato)
    setRuoliUtenteLoggato({ patchState }: StateContext<RuoliUtenteLoggatoStateModel>, action: SetRuoliUtenteLoggato): void {
        patchState({
            ruoliPrincipali: action.ruoliUtenteLoggato,
            ruoli: this.getRuoliFullList(action.ruoliUtenteLoggato)
        });
        sessionStorage.setItem(LSNAME.role, JSON.stringify(action.ruoliUtenteLoggato));
    }

    @Action(UpdateRuoliUtenteLoggato)
    updateRuoliUtenteLoggato({ patchState }: StateContext<RuoliUtenteLoggatoStateModel>, action: UpdateRuoliUtenteLoggato): void {
        patchState({
            ruoliPrincipali: action.ruoliUtenteLoggato,
            ruoli: this.getRuoliFullList(action.ruoliUtenteLoggato)
        });
        sessionStorage.setItem(LSNAME.role, JSON.stringify(action.ruoliUtenteLoggato));
    }

    @Action(ClearRuoliUtenteLoggato)
    clearRuoliUtenteLoggato({ patchState }: StateContext<RuoliUtenteLoggatoStateModel>): void {
        patchState({
            ruoli: ruoliStateModelDefaults.ruoli
        });
        sessionStorage.removeItem(LSNAME.role);
    }

    getRuoliFullList(ruoliRicorsivi: Ruolo[]): Ruolo[] {
        const ruoli: Ruolo[] = [];
        const listaSedi = this.store.selectSnapshot(NavbarState.listaSedi);
        if (ruoliRicorsivi && ruoliRicorsivi.length > 0) {
            ruoliRicorsivi.forEach(ruoloRicorsivo => {
                if (ruoloRicorsivo.ricorsivo) {
                    ruoli.push(...getRuoliRicorsivo(ruoloRicorsivo, listaSedi));
                } else {
                    ruoli.push(ruoloRicorsivo);
                }
            });
        }
        return ruoli;
    }
}
