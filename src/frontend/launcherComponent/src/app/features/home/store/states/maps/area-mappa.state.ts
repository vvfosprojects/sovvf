import { AreaMappa } from '../../../maps/maps-model/area-mappa-model';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { GetRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';
import { GetSediMarkers } from '../../actions/maps/sedi-markers.actions';
import { ViewComponentState } from '../view/view.state';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import { SetBoundsIniziale } from '../../actions/home.actions';
import { ComposizionePartenzaState } from '../composizione-partenza/composizione-partenza.state';
import { GetSchedeContattoMarkers } from '../../actions/maps/schede-contatto-markers.actions';
import {
    GetMarkersMappa,
    SetAreaMappa,
    StartLoadingAreaMappa,
    StopLoadingAreaMappa
} from '../../actions/maps/area-mappa.actions';
import { Injectable } from '@angular/core';

export interface AreaMappaStateModel {
    areaMappa: AreaMappa;
    areaMappaLoading: number;
}

export const AreaMappaStateDefaults: AreaMappaStateModel = {
    areaMappa: null,
    areaMappaLoading: 0
};

@Injectable()
@State<AreaMappaStateModel>({
    name: 'areaMappa',
    defaults: AreaMappaStateDefaults
})
export class AreaMappaState {

    @Selector()
    static areaMappa(state: AreaMappaStateModel): AreaMappa {
        return state.areaMappa;
    }

    @Selector()
    static areaMappaLoading(state: AreaMappaStateModel): boolean {
        return state.areaMappaLoading !== 0;
    }

    constructor(private store: Store) {
        this.store.dispatch(new GetMarkersMappa());
    }

    @Action(SetAreaMappa)
    setAreaMappa({ patchState, dispatch }: StateContext<AreaMappaStateModel>, action: SetAreaMappa): void {
        console.log('@Action(SetAreaMappa)', JSON.stringify(action.areaMappa));
        patchState({
            areaMappa: action.areaMappa
        });
        dispatch([
            new GetMarkersMappa(),
            new SetBoundsIniziale(action.areaMappa)
        ]);
    }

    @Action(GetMarkersMappa)
    getMarkerMappa({ getState, dispatch }: StateContext<AreaMappaStateModel>): void {
        const state = getState();
        if (state.areaMappa) {
            const composizioneModeOn = this.store.selectSnapshot(ViewComponentState.composizioneStatus);
            if (composizioneModeOn) {
                const composizioneLoaded = this.store.selectSnapshot(ComposizionePartenzaState.loaded);
                if (!composizioneLoaded) {
                    return;
                }
            }
            dispatch([
                new GetRichiesteMarkers(state.areaMappa),
                new GetSediMarkers(state.areaMappa),
                new GetSchedeContattoMarkers(state.areaMappa)
            ]);
        }
    }

    @Action(StartLoadingAreaMappa)
    startLoadingAreaMappa({ getState, patchState }: StateContext<AreaMappaStateModel>): void {
        const valoreAttuale = makeCopy(getState().areaMappaLoading);
        const nuovoValore = valoreAttuale + 1;
        patchState({
            areaMappaLoading: nuovoValore
        });
    }

    @Action(StopLoadingAreaMappa)
    stopLoadingAreaMappa({ getState, patchState }: StateContext<AreaMappaStateModel>): void {
        const valoreAttuale = makeCopy(getState().areaMappaLoading);
        const nuovoValore = valoreAttuale - 1;
        patchState({
            areaMappaLoading: nuovoValore
        });
    }

}
