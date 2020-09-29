import { Action, State, StateContext } from '@ngxs/store';
import {
    ResetRicercaMezziComposizione,
    ResetRicercaSquadreComposizione,
    SetRicercaMezziComposizione,
    SetRicercaSquadreComposizione
} from '../../actions/ricerca-composizione/ricerca-composizione.actions';

export interface RicercaComposizioneStateStateModel {
    ricercaSquadre: string;
    ricercaMezzi: string;
}

export const RicercaComposizioneStateDefaults: RicercaComposizioneStateStateModel = {
    ricercaSquadre: undefined,
    ricercaMezzi: undefined
};

@State<RicercaComposizioneStateStateModel>({
    name: 'ricercaComposizione',
    defaults: RicercaComposizioneStateDefaults
})
export class RicercaComposizioneState {


    @Action(SetRicercaSquadreComposizione)
    setRicercaSquadreComposizione({ patchState }: StateContext<RicercaComposizioneStateStateModel>, action: SetRicercaSquadreComposizione) {
        patchState({
            ricercaSquadre: action.ricerca
        });
    }

    @Action(ResetRicercaSquadreComposizione)
    resetRicercaSquadreComposizione({ patchState }: StateContext<RicercaComposizioneStateStateModel>) {
        patchState({
            ricercaSquadre: RicercaComposizioneStateDefaults.ricercaSquadre
        });
    }

    @Action(SetRicercaMezziComposizione)
    setRicercaMezziComposizione({ patchState }: StateContext<RicercaComposizioneStateStateModel>, action: SetRicercaMezziComposizione) {
        patchState({
            ricercaMezzi: action.ricerca
        });
    }

    @Action(ResetRicercaMezziComposizione)
    resetRicercaMezziComposizione({ patchState }: StateContext<RicercaComposizioneStateStateModel>) {
        patchState({
            ricercaMezzi: RicercaComposizioneStateDefaults.ricercaMezzi
        });
    }
}
