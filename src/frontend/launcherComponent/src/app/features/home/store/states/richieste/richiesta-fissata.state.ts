import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetRichiestaFissata, ClearRichiestaFissata, SetEspanso, UpdateRichiestaFissata } from '../../actions/richieste/richiesta-fissata.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from '../../../../../core/service/lista-richieste-service/lista-richieste.service';
import { patch, updateItem } from '@ngxs/store/operators';

export interface RichiestaFissataStateModel {
    idRichiestaFissata: string;
    richiestaFissata: SintesiRichiesta;
    espanso: boolean;
}

export const RichiestaFissataStateDefaults: RichiestaFissataStateModel = {
    idRichiestaFissata: null,
    richiestaFissata: null,
    espanso: false
};

@State<RichiestaFissataStateModel>({
    name: 'richiestaFissata',
    defaults: RichiestaFissataStateDefaults
})
export class RichiestaFissataState {

    constructor(private _richiesteService: SintesiRichiesteService) {
    }

    @Selector()
    static idRichiestaFissata(state: RichiestaFissataStateModel) {
        return state.idRichiestaFissata;
    }

    @Selector()
    static richiestaFissata(state: RichiestaFissataStateModel) {
        return state.richiestaFissata;
    }

    @Selector()
    static espanso(state: RichiestaFissataStateModel) {
        return state.espanso;
    }

    @Action(SetRichiestaFissata)
    setRichiestaFissata({ patchState }: StateContext<RichiestaFissataStateModel>, action: SetRichiestaFissata) {
        this._richiesteService.getRichiestaById(action.codiceRichiesta).subscribe((r: SintesiRichiesta) => {
            patchState({
                idRichiestaFissata: action.idRichiesta,
                richiestaFissata: r
            });
        });
    }

    @Action(UpdateRichiestaFissata)
    updateRichiestaFissata({ patchState }: StateContext<RichiestaFissataStateModel>, action: UpdateRichiestaFissata) {
        patchState({
            richiestaFissata: action.richiesa
        });
    }

    @Action(ClearRichiestaFissata)
    clearRichiestaFissata({ patchState }: StateContext<RichiestaFissataStateModel>) {
        patchState(RichiestaFissataStateDefaults);
    }

    @Action(SetEspanso)
    setEspanso({ getState, patchState }: StateContext<RichiestaFissataStateModel>, action: SetEspanso) {
        const state = getState();
        patchState({
            espanso: action.espanso === undefined ? !state.espanso : action.espanso
        });
    }
}
