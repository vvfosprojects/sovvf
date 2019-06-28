import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Action
import { AddRichiesta, ClearRichieste, GetRichieste, PatchRichiesta, SetRichieste, UpdateRichiesta } from '../../actions/richieste/richieste.actions';

// Service
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';
import { RichiestaFissataState } from './richiesta-fissata.state';
import { RichiestaHoverState } from './richiesta-hover.state';
import { RichiestaSelezionataState } from './richiesta-selezionata.state';
import { RichiestaModificaState } from './richiesta-modifica.state';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SuccessRichiestaModifica } from '../../actions/richieste/richiesta-modifica.actions';
import { ComposizionePartenzaState } from '../composizione-partenza/composizione-partenza.state';
import { UpdateRichiestaComposizione } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { AddBoxPartenza, ClearBoxPartenze } from '../../actions/composizione-partenza/box-partenza.actions';

export interface RichiesteStateModel {
    richieste: SintesiRichiesta[];
}

export const RichiesteStateDefaults: RichiesteStateModel = {
    richieste: []
};

@State<RichiesteStateModel>({
    name: 'richieste',
    defaults: RichiesteStateDefaults,
    children: [RichiestaFissataState, RichiestaHoverState, RichiestaSelezionataState, RichiestaModificaState]
})
export class RichiesteState {

    // SELECTORS
    @Selector()
    static richieste(state: RichiesteStateModel) {
        return state.richieste;
    }

    @Selector()
    static getRichiestaById(state: RichiesteStateModel) {
        return (id: string) => state.richieste.find(x => x.codiceRichiesta === id);
    }

    constructor(private richiesteService: SintesiRichiesteService,
                private store: Store) {
    }

    @Action(GetRichieste, { cancelUncompleted: true })
    getRichieste({ dispatch }: StateContext<RichiesteStateModel>, action: GetRichieste) {
        this.richiesteService.getRichieste(action.idUltimaRichiesta).subscribe((data: SintesiRichiesta[]) => {
            dispatch(new SetRichieste(data));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(PatchRichiesta)
    patchRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: PatchRichiesta) {
        this.richiesteService.patchRichiesta(action.richiesta).subscribe(() => {
            dispatch(new SuccessRichiestaModifica);
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetRichieste)
    setRichieste({ patchState }: StateContext<RichiesteStateModel>, action: SetRichieste) {
        patchState({
            richieste: action.richieste
        });
    }

    @Action(ClearRichieste)
    clearRichieste({ patchState }: StateContext<RichiesteStateModel>) {
        patchState(RichiesteStateDefaults);
    }

    @Action(UpdateRichiesta)
    updateRichiesta({ setState, dispatch }: StateContext<RichiesteStateModel>, { richiesta }: UpdateRichiesta) {
        // Controllo se la richiesta aggiornata è anche la richiesta attualmente in composzione
        const richiestaComposzione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        if (richiestaComposzione && richiestaComposzione.id === richiesta.id) {
            // console.log('richiesta', richiesta);
            dispatch(new UpdateRichiestaComposizione(richiesta));
            dispatch(new ClearBoxPartenze());
            dispatch(new AddBoxPartenza());
        }

        setState(
            patch({
                richieste: updateItem<SintesiRichiesta>(r => r.id === richiesta.id, richiesta)
            })
        );
    }

    @Action(AddRichiesta)
    addRichiesta({ getState, setState }: StateContext<RichiesteStateModel>, { richiesta }: AddRichiesta) {
        const state = getState();
        const beforePosition = state.richieste.length > 0 ? 0 : null;
        setState(
            patch({
                richieste: insertItem(richiesta, beforePosition)
            })
        );
    }
}
