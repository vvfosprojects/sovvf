import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ResetRicercaMezziComposizione, ResetRicercaSquadreComposizione, SetRicercaMezziComposizione, SetRicercaSquadreComposizione } from '../../actions/ricerca-composizione/ricerca-composizione.actions';
import { Injectable } from '@angular/core';

export interface RicercaComposizioneStateStateModel {
    ricercaMezzi: string;
    ricercaSquadre: string;
}

export const RicercaComposizioneStateDefaults: RicercaComposizioneStateStateModel = {
    ricercaMezzi: undefined,
    ricercaSquadre: undefined,
};

@Injectable()
@State<RicercaComposizioneStateStateModel>({
    name: 'ricercaComposizione',
    defaults: RicercaComposizioneStateDefaults
})
export class RicercaComposizioneState {

    @Selector()
    static ricercaMezzi(state: RicercaComposizioneStateStateModel): string {
        return state.ricercaMezzi;
    }

    @Selector()
    static ricercaSquadre(state: RicercaComposizioneStateStateModel): string {
        return state.ricercaSquadre;
    }

    @Action(SetRicercaSquadreComposizione)
    setRicercaSquadreComposizione({ patchState }: StateContext<RicercaComposizioneStateStateModel>, action: SetRicercaSquadreComposizione): void {
        patchState({
            ricercaSquadre: action.ricerca
        });
    }

    @Action(ResetRicercaSquadreComposizione)
    resetRicercaSquadreComposizione({ patchState }: StateContext<RicercaComposizioneStateStateModel>): void {
        patchState({
            ricercaSquadre: RicercaComposizioneStateDefaults.ricercaSquadre
        });
    }

    @Action(SetRicercaMezziComposizione)
    setRicercaMezziComposizione({ patchState }: StateContext<RicercaComposizioneStateStateModel>, action: SetRicercaMezziComposizione): void {
        patchState({
            ricercaMezzi: action.ricerca
        });
    }

    @Action(ResetRicercaMezziComposizione)
    resetRicercaMezziComposizione({ patchState }: StateContext<RicercaComposizioneStateStateModel>): void {
        patchState({
            ricercaMezzi: RicercaComposizioneStateDefaults.ricercaMezzi
        });
    }
}
