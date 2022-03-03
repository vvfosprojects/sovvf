import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    ClearPartenza,
    ConfirmPartenze,
    ReducerFilterListeComposizione,
    SetRichiestaComposizione,
    SetComposizioneMode,
    StartInvioPartenzaLoading,
    StopInvioPartenzaLoading,
    TerminaComposizione,
    ToggleComposizioneMode,
    UpdateListeComposizione,
    UpdateRichiestaComposizione,
    StartListaSquadreComposizioneLoading,
    StartListaMezziComposizioneLoading,
    StopListaSquadreComposizioneLoading,
    StopListaMezziComposizioneLoading,
    SetVisualizzaPercosiRichiesta,
    StartPreaccoppiatiComposizioneLoading,
    StopPreaccoppiatiComposizioneLoading
} from '../../actions/composizione-partenza/composizione-partenza.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ComposizioneMarker } from '../../../../maps/maps-model/composizione-marker.model';
import { ClearComposizioneVeloce, ClearPreaccoppiati, ClearPreAccoppiatiSelezionatiComposizione, GetListaComposizioneVeloce } from '../../actions/composizione-partenza/composizione-veloce.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { ClearComposizioneAvanzata, GetListeComposizioneAvanzata, UnselectMezziAndSquadreComposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ClearListaMezziComposizione, ClearMezzoComposizione, ClearSelectedMezziComposizione } from '../../../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import { ClearListaSquadreComposizione, ClearSelectedSquadreComposizione, ClearSquadraComposizione } from '../../../../../shared/store/actions/squadre-composizione/squadre-composizione.actions';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import { ClearDirection } from '../../../../maps/store/actions/maps-direction.actions';
import { GetInitCentroMappa } from '../../../../maps/store/actions/centro-mappa.actions';
import { ClearBoxPartenze } from '../../actions/composizione-partenza/box-partenza.actions';
import { SetTriageSummary } from '../../../../../shared/store/actions/triage-summary/triage-summary.actions';
import { ShowToastr } from 'src/app/shared/store/actions/toastr/toastr.actions';
import { ToastrType } from 'src/app/shared/enum/toastr';
import { Injectable } from '@angular/core';
import { RichiestaSelezionataState } from '../richieste/richiesta-selezionata.state';

export interface ComposizionePartenzaStateModel {
    richiesta: SintesiRichiesta;
    composizioneMode: Composizione;
    visualizzaPercorsiRichiesta: boolean;
    loadingSquadre: boolean;
    loadingMezzi: boolean;
    loadingPreaccoppiati: boolean;
    loadingInvioPartenza: boolean;
    loaded: boolean;
}

export const ComposizioneStateDefaults: ComposizionePartenzaStateModel = {
    richiesta: null,
    composizioneMode: Composizione.Avanzata,
    visualizzaPercorsiRichiesta: false,
    loadingSquadre: false,
    loadingMezzi: false,
    loadingPreaccoppiati: false,
    loadingInvioPartenza: false,
    loaded: null
};

@Injectable()
@State<ComposizionePartenzaStateModel>({
    name: 'composizionePartenza',
    defaults: ComposizioneStateDefaults
})

export class ComposizionePartenzaState {

    @Selector()
    static composizioneMode(state: ComposizionePartenzaStateModel): Composizione {
        return state.composizioneMode;
    }

    @Selector()
    static richiestaComposizione(state: ComposizionePartenzaStateModel): SintesiRichiesta {
        return state.richiesta;
    }

    @Selector()
    static richiestaComposizioneMarker(state: ComposizionePartenzaStateModel): ComposizioneMarker[] {
        let composizioneMarkers: ComposizioneMarker[] = [];
        if (state.richiesta !== ComposizioneStateDefaults.richiesta) {
            const composizioneMarker = new ComposizioneMarker(
                state.richiesta.id, state.richiesta.localita, state.richiesta.tipologie, null,
                state.richiesta.prioritaRichiesta, state.richiesta.stato, true, false);
            composizioneMarkers.push(composizioneMarker);
        } else {
            composizioneMarkers = [];
        }
        return composizioneMarkers;
    }

    @Selector()
    static visualizzaPercorsiRichiesta(state: ComposizionePartenzaStateModel): boolean {
        return state.visualizzaPercorsiRichiesta;
    }

    @Selector()
    static loadingSquadre(state: ComposizionePartenzaStateModel): boolean {
        return state.loadingSquadre;
    }

    @Selector()
    static loadingMezzi(state: ComposizionePartenzaStateModel): boolean {
        return state.loadingMezzi;
    }

    @Selector()
    static loadingPreaccoppiati(state: ComposizionePartenzaStateModel): boolean {
        return state.loadingPreaccoppiati;
    }

    @Selector()
    static loadingInvioPartenza(state: ComposizionePartenzaStateModel): boolean {
        return state.loadingInvioPartenza;
    }

    @Selector()
    static loaded(state: ComposizionePartenzaStateModel): boolean {
        return state.loaded;
    }

    constructor(private store: Store,
                private compPartenzaService: CompPartenzaService) {
    }

    @Action(UpdateListeComposizione)
    updateListe({ dispatch }: StateContext<ComposizionePartenzaStateModel>): void {
        dispatch(new GetListeComposizioneAvanzata());
    }

    @Action(ReducerFilterListeComposizione)
    reducerFilterListeComposizione({ getState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: any): void {
        const state = getState();
        const compMode = state.composizioneMode;

        if (compMode === Composizione.Avanzata) {
            if (action.tipo === 'tipoMezzo') {
                dispatch(new GetListeComposizioneAvanzata(null, true));
            } else if (action.tipo === 'turno') {
                dispatch(new GetListeComposizioneAvanzata(null, false, true));
            } else {
                dispatch(new GetListeComposizioneAvanzata());
            }
        } else if (compMode === Composizione.Veloce) {
            dispatch(new GetListaComposizioneVeloce());
        }
    }

    @Action(SetRichiestaComposizione)
    setRichiestaComposizione({ patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: SetRichiestaComposizione): void {
        patchState({
            richiesta: action.richiesta
        });

        dispatch([
            new SetTriageSummary(action.richiesta.triageSummary)
        ]);
    }

    @Action(ToggleComposizioneMode)
    toggleComposizioneMode({ getState, patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        const state = getState();
        const composizioneMode = state.composizioneMode as Composizione;

        if (composizioneMode === Composizione.Avanzata) {
            patchState({
                composizioneMode: Composizione.Veloce
            });
        } else {
            patchState({
                composizioneMode: Composizione.Avanzata
            });
        }
    }

    @Action(SetComposizioneMode)
    setComposizioneMode({ patchState }: StateContext<ComposizionePartenzaStateModel>, action: SetComposizioneMode): void {
        patchState({
            composizioneMode: action.compMode
        });
    }

    @Action(SetVisualizzaPercosiRichiesta)
    setVisualizzaPercosiRichiesta({ patchState }: StateContext<ComposizionePartenzaStateModel>, action: SetVisualizzaPercosiRichiesta): void {
        patchState({
            visualizzaPercorsiRichiesta: action.value
        });
    }

    @Action(UpdateRichiestaComposizione)
    updateRichiestaComposizione({ patchState }: StateContext<ComposizionePartenzaStateModel>, action: UpdateRichiestaComposizione): void {
        patchState({
            richiesta: action.richiesta
        });
    }

    @Action(ConfirmPartenze)
    confirmPartenze({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: ConfirmPartenze): void {
        const state = getState();
        dispatch(new StartInvioPartenzaLoading());
        this.compPartenzaService.confermaPartenze(action.partenze).subscribe(() => {
            if (state.composizioneMode === Composizione.Avanzata) {
                dispatch([
                    new ClearBoxPartenze(),
                    new ClearSelectedMezziComposizione(),
                    new ClearSelectedSquadreComposizione(),
                    new UnselectMezziAndSquadreComposizioneAvanzata(),
                    new ClearListaMezziComposizione(),
                    new ClearListaSquadreComposizione()
                ]);
            } else if (state.composizioneMode === Composizione.Veloce) {
                dispatch([
                    new ClearPreAccoppiatiSelezionatiComposizione(),
                    new ClearPreaccoppiati(),
                    new GetListaComposizioneVeloce()
                ]);
            }
            dispatch([
                new StopInvioPartenzaLoading(),
                new ClearDirection()
            ]);
            const composizioneActive = !!(getState().richiesta);
            if (composizioneActive && state.composizioneMode !== Composizione.Veloce) {
                dispatch(new GetListeComposizioneAvanzata());
            }
            /*else {
                dispatch(new GetListaMezziSquadre());
            }*/
            dispatch(new ShowToastr(ToastrType.Success, 'Partenza inviata con successo'));
        }, () => {
            dispatch([
                new StopInvioPartenzaLoading(),
            ]);
            if (state.composizioneMode === Composizione.Avanzata) {
                dispatch([
                    new ClearBoxPartenze(),
                    new ClearSelectedMezziComposizione(),
                    new ClearSelectedSquadreComposizione(),
                    new UnselectMezziAndSquadreComposizioneAvanzata(),
                    new ClearListaMezziComposizione(),
                    new ClearListaSquadreComposizione(),
                    new GetListeComposizioneAvanzata()
                ]);
            } else if (state.composizioneMode === Composizione.Veloce) {
                dispatch([
                    new ClearPreAccoppiatiSelezionatiComposizione(),
                    new ClearPreaccoppiati(),
                    new GetListaComposizioneVeloce()
                ]);
            }
        });
    }

    @Action(TerminaComposizione)
    terminaComposizione({ dispatch }: StateContext<ComposizionePartenzaStateModel>): void {
        const idRichiestaSelezionata = this.store.selectSnapshot(RichiestaSelezionataState.idRichiestaSelezionata);
        dispatch([
            !idRichiestaSelezionata && new GetInitCentroMappa(),
            new ClearDirection(),
            new ClearComposizioneVeloce(),
            new ClearComposizioneAvanzata(),
            new ClearMezzoComposizione(),
            new ClearSquadraComposizione(),
            new ClearPartenza()
        ]);
    }

    @Action(ClearPartenza)
    clearPartenza({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState(ComposizioneStateDefaults);
    }

    @Action(StartListaSquadreComposizioneLoading)
    startListaSquadreComposizioneLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState({
            loadingSquadre: true,
            loaded: false
        });
    }

    @Action(StartListaMezziComposizioneLoading)
    startListaMezziComposizioneLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState({
            loadingMezzi: true,
            loaded: false
        });
    }

    @Action(StartPreaccoppiatiComposizioneLoading)
    StartPreaccoppiatiComposizioneLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState({
            loadingPreaccoppiati: true,
            loaded: false
        });
    }

    @Action(StopListaSquadreComposizioneLoading)
    stopListaSquadreComposizioneLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState({
            loadingSquadre: false,
            loaded: true
        });
    }

    @Action(StopListaMezziComposizioneLoading)
    stopListaMezziComposizioneLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState({
            loadingMezzi: false,
            loaded: true
        });
    }

    @Action(StopPreaccoppiatiComposizioneLoading)
    stopPreaccoppiatiComposizioneLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState({
            loadingPreaccoppiati: false,
            loaded: true
        });
    }

    @Action(StartInvioPartenzaLoading)
    startInvioPartenzaLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState({
            loadingInvioPartenza: true
        });
    }

    @Action(StopInvioPartenzaLoading)
    stopInvioPartenzaLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>): void {
        patchState({
            loadingInvioPartenza: false
        });
    }
}
