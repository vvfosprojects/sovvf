import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { makeCopy } from '../../../../../shared/helper/function';
import { AppFeatures } from '../../../../../shared/enum/app-features.enum';
import { Grid } from '../../../../../shared/enum/layout.enum';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import {
    ChangeView,
    SaveView,
    SwitchComposizione,
    ToggleChiamata,
    ToggleComposizione,
    ToggleModifica,
    TurnOffComposizione,
    ToggleMezziInServizio,
    ToggleSchedeContatto,
    ClearViewState
} from '../../actions/view/view.actions';
import { BackupViewComponentState } from './save-view.state';
import {
    Grids,
    ViewComponentStateModel,
    ViewInterfaceButton,
    ViewInterfaceMaps,
    ViewLayouts
} from '../../../../../shared/interface/view.interface';
import {
    activeChiamata,
    activeComposizione,
    activeModifica,
    colorButton,
    switchComposizione,
    turnOffComposizione,
    turnOffModifica,
    updateView,
    viewStateMaps,
    activeMezziInServizio,
    activeSchedeContatto
} from '../../helper/view-state-function';
import { GetInitCentroMappa, SetCoordCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { ClearDirection } from '../../actions/maps/maps-direction.actions';
import { ClearMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { ResetChiamata } from '../../actions/scheda-telefonata/chiamata.actions';
import { ComposizionePartenzaState } from '../composizione-partenza/composizione-partenza.state';
import { TerminaComposizione, ToggleComposizioneMode } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ClearListaSchedeContatto, ClearSchedaContattoTelefonata } from '../../actions/schede-contatto/schede-contatto.actions';
import { Injectable } from '@angular/core';

export const ViewComponentStateDefault: ViewComponentStateModel = {
    view: {
        richieste: {
            active: true,
            split: false
        },
        mappa: {
            active: false,
            split: false
        },
        chiamata: {
            active: false
        },
        composizione: {
            active: false
        },
        filterbar: {
            active: true,
            options: [Grid.Col5]
        },
        modifica: {
            active: false
        },
        mezziInServizio: {
            active: false
        },
        schedeContatto: {
            active: false
        }
    },
    column: {
        sinistra: Grid.Col6,
        destra: Grid.Col6
    }
};

@Injectable()
@State<ViewComponentStateModel>({
    name: 'viewComponent',
    defaults: ViewComponentStateDefault,
    children: [BackupViewComponentState]
})

export class ViewComponentState {

    constructor(private store: Store) {
    }

    @Selector()
    static viewComponent(state: ViewComponentStateModel): ViewLayouts {
        return state.view;
    }

    @Selector()
    static columnGrid(state: ViewComponentStateModel): Grids {
        return state.column;
    }

    @Selector()
    static composizioneMode(state: ViewComponentStateModel): Composizione {
        return state.view.composizione.options[0];
    }

    @Selector()
    static filterBarCol(state: ViewComponentStateModel): Grid {
        return state.view.filterbar.options[0];
    }

    @Selector()
    static composizioneStatus(state: ViewComponentStateModel): boolean {
        return state.view.composizione.active;
    }

    @Selector()
    static chiamataStatus(state: ViewComponentStateModel): boolean {
        return state.view.chiamata.active;
    }

    @Selector()
    static modificaRichiestaStatus(state: ViewComponentStateModel): boolean {
        return state.view.modifica.active;
    }

    @Selector()
    static schedeContattoStatus(state: ViewComponentStateModel): boolean {
        return state.view.schedeContatto.active;
    }

    @Selector()
    static mezziInServizioStatus(state: ViewComponentStateModel): boolean {
        return state.view.mezziInServizio.active;
    }

    @Selector()
    static colorButton(state: ViewComponentStateModel): ViewInterfaceButton {
        return colorButton(state);
    }

    @Selector()
    static viewStateMaps(state: ViewComponentStateModel): ViewInterfaceMaps {
        return viewStateMaps(state);
    }

    @Selector()
    static mapsIsActive(state: ViewComponentStateModel): boolean {
        return state.view.mappa.active;
    }

    @Selector()
    static richiesteStatus(state: ViewComponentStateModel): boolean {
        return state.view.richieste.active;
    }

    @Action(ChangeView)
    changeView({ getState, patchState }: StateContext<ViewComponentStateModel>, action: ChangeView): void {
        const state = getState();
        const stateDefault = makeCopy(ViewComponentStateDefault);
        const newState = updateView(stateDefault, action);
        patchState({
            ...state,
            view: newState.view,
            column: newState.column
        });
    }

    @Action(ToggleChiamata)
    toggleChiamata({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>, action: ToggleChiamata): void {
        const state = getState();
        const stateDefault = makeCopy(ViewComponentStateDefault);
        /**
         * se lo stato della chiamata non è attivo creo uno snapshot, altrimenti ritorno allo stato precedente
         */
        if (!state.view.chiamata.active && !action.toggle) {
            dispatch(new ClearDirection());
            dispatch(new ClearMarkerRichiestaSelezionato());
            dispatch(new GetInitCentroMappa());
            dispatch(new SaveView(makeCopy(state)));
            const newState = activeChiamata(stateDefault);
            patchState({
                ...state,
                view: newState.view,
                column: newState.column
            });
        } else {
            const lastState: ViewComponentStateModel = this.store.selectSnapshot(BackupViewComponentState);
            patchState({
                ...state,
                view: lastState.view,
                column: lastState.column
            });
            dispatch(new ResetChiamata());
            dispatch(new ClearSchedaContattoTelefonata());
        }
    }

    @Action(ToggleModifica)
    toggleModifica({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>, action: ToggleModifica): void {
        const state = getState();
        const currentState = makeCopy(state);
        const stateDefault = makeCopy(ViewComponentStateDefault);
        /**
         * se lo stato della modifica non è attivo creo uno snapshot, altrimenti ritorno allo stato precedente
         */
        if (!state.view.modifica.active && !action.toggle) {
            dispatch(new ClearDirection());

            dispatch(new SaveView(currentState));
            const newState = activeModifica(stateDefault);
            patchState({
                ...state,
                view: newState.view,
                column: newState.column
            });
        } else {
            dispatch(new ClearMarkerRichiestaSelezionato());
            dispatch(new GetInitCentroMappa());
            const lastState: ViewComponentStateModel = this.store.selectSnapshot(BackupViewComponentState);
            const newState = turnOffModifica(currentState, lastState);
            patchState({
                ...state,
                view: newState.view,
                column: newState.column
            });
        }
    }

    @Action(ToggleComposizione)
    toggleComposizione({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>, action: ToggleComposizione): void {
        const state = getState();
        const stateDefault = makeCopy(ViewComponentStateDefault);
        dispatch(new SaveView(makeCopy(state)));
        const newState = activeComposizione(stateDefault, action.modalita);
        patchState({
            ...state,
            view: newState.view,
            column: newState.column
        });
    }

    @Action(TurnOffComposizione)
    turnOffComposizione({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>): void {
        const state = getState();
        const currentState = makeCopy(state);
        const lastState: ViewComponentStateModel = this.store.selectSnapshot(BackupViewComponentState);
        const newState = turnOffComposizione(currentState, lastState);
        patchState({
            ...state,
            view: newState.view,
            column: newState.column
        });
        dispatch(new TerminaComposizione());
    }

    @Action(SwitchComposizione)
    switchComposizione({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>, action: SwitchComposizione): void {
        const state = getState();
        const currentState = makeCopy(state);
        const newState = switchComposizione(currentState, action.modalita);
        dispatch(new ClearDirection());
        dispatch(new ToggleComposizioneMode());
        this.store.select(ComposizionePartenzaState.richiestaComposizione).subscribe(richiesta => {
            if (richiesta) {
                dispatch(new SetCoordCentroMappa(richiesta.localita.coordinate));
            }
        });
        patchState({
            ...state,
            view: newState.view,
            column: newState.column
        });
    }

    @Action(ToggleMezziInServizio)
    toggleGestioneRisorse({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>): void {
        const state = getState();
        const stateDefault = makeCopy(ViewComponentStateDefault);

        /**
         * se lo stato dei mezzi in servizio non è attivo creo uno snapshot, altrimenti ritorno allo stato precedente
         */
        if (!state.view.mezziInServizio.active) {
            dispatch(new ClearDirection());
            dispatch(new ClearMarkerRichiestaSelezionato());
            dispatch(new GetInitCentroMappa());
            dispatch(new SaveView(makeCopy(state)));
            const newState = activeMezziInServizio(stateDefault);
            patchState({
                ...state,
                view: newState.view,
                column: newState.column
            });
        } else {
            patchState(ViewComponentStateDefault);
        }
    }

    @Action(ToggleSchedeContatto)
    toggleSchedeContatto({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>): void {
        const state = getState();
        const stateDefault = makeCopy(ViewComponentStateDefault);
        if (!state.view.schedeContatto.active) {
            dispatch(new SaveView(makeCopy(state)));
            const newState = activeSchedeContatto(stateDefault);
            patchState({
                ...state,
                view: newState.view,
                column: newState.column
            });
        } else {
            dispatch(new ClearSchedaContattoTelefonata());
            dispatch(new ClearListaSchedeContatto());
            patchState(ViewComponentStateDefault);
        }
    }

    @Action(ClearViewState)
    clearViewState({ patchState }: StateContext<ViewComponentStateModel>): void {
        patchState(ViewComponentStateDefault);
    }
}
