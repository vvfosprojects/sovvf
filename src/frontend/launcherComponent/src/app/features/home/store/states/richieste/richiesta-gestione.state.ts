import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ClearRichiestaGestione, SetRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { Injectable } from '@angular/core';
import { AddConcorrenza, DeleteConcorrenza } from '../../../../../shared/store/actions/concorrenza/concorrenza.actions';
import { TipoConcorrenzaEnum } from '../../../../../shared/enum/tipo-concorrenza.enum';
import { ConcorrenzaState } from '../../../../../shared/store/states/concorrenza/concorrenza.state';
import { ConcorrenzaInterface } from '../../../../../shared/interface/concorrenza.interface';
import { AddConcorrenzaDtoInterface } from '../../../../../shared/interface/dto/concorrenza/add-concorrenza-dto.interface';

export interface RichiestaGestioneStateModel {
    richiestaGestione: SintesiRichiesta;
}

export const RichiestaGestioneStateDefaults: RichiestaGestioneStateModel = {
    richiestaGestione: null
};

@Injectable()
@State<RichiestaGestioneStateModel>({
    name: 'richiestaGestione',
    defaults: RichiestaGestioneStateDefaults
})
export class RichiestaGestioneState {

    constructor(private store: Store) {
    }

    @Selector()
    static richiestaGestione(state: RichiestaGestioneStateModel): SintesiRichiesta {
        return state.richiestaGestione;
    }

    @Selector()
    static idRichiestaGestione(state: RichiestaGestioneStateModel): string {
        return state.richiestaGestione ? state.richiestaGestione.id : null;
    }

    @Action(SetRichiestaGestione)
    setRichiestaGestione({ getState, patchState, dispatch }: StateContext<RichiestaGestioneStateModel>, action: SetRichiestaGestione): void {
        const state = getState();
        const concorrenza = this.store.selectSnapshot(ConcorrenzaState.concorrenza);
        const isInConcorrenza = concorrenza.filter((c: ConcorrenzaInterface) => c.type === TipoConcorrenzaEnum.Richiesta && c.value === action.richiesta.codice)?.length > 0;
        if (state.richiestaGestione && state.richiestaGestione.codice === action.richiesta.codice && !action.toggle) {
            dispatch([
                new DeleteConcorrenza(TipoConcorrenzaEnum.Richiesta),
                new ClearRichiestaGestione()
            ]);
        } else {
            if (!isInConcorrenza) {
                const data = {
                    type: TipoConcorrenzaEnum.Richiesta,
                    value: action.richiesta.codice
                } as AddConcorrenzaDtoInterface;
                dispatch(new AddConcorrenza([data]));
            }
            patchState({
                richiestaGestione: action.richiesta
            });
        }
    }

    @Action(ClearRichiestaGestione)
    clearRichiestaGestione({ patchState }: StateContext<RichiestaGestioneStateModel>): void {
        patchState(RichiestaGestioneStateDefaults);
    }
}
