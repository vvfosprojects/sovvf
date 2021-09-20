import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetRicercaAreaDocumentale, ClearRicercaAreaDocumentale } from '../../actions/ricerca-area-documentale/ricerca-area-documentale.actions';

export interface RicercaAreaDocumentaleStateModel {
    ricerca: string;
}

export const RicercaAreaDocumentaleStateDefaults: RicercaAreaDocumentaleStateModel = {
    ricerca: undefined
};

@Injectable()
@State<RicercaAreaDocumentaleStateModel>({
    name: 'ricercaAreaDocumentale',
    defaults: RicercaAreaDocumentaleStateDefaults
})
export class RicercaAreaDocumentaleState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaAreaDocumentaleStateModel): string {
        return state.ricerca;
    }

    @Action(SetRicercaAreaDocumentale)
    setRicercaDocumento({ patchState }: StateContext<RicercaAreaDocumentaleStateModel>, action: SetRicercaAreaDocumentale): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaAreaDocumentale)
    clearRicercaDocumento({ patchState }: StateContext<RicercaAreaDocumentaleStateModel>): void {
        patchState({
            ricerca: RicercaAreaDocumentaleStateDefaults.ricerca
        });
    }
}
