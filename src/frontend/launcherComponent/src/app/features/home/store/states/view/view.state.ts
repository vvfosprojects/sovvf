import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { makeCopy } from '../../../../../shared/helper/function';
import { AppFeatures } from '../../../../../shared/enum/app-features.enum';
import { Grid } from '../../../../../shared/enum/layout.enum';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { ChangeView, SaveView, SwitchComposizione, ToggleChiamata, ToggleComposizione, TurnOffComposizione } from '../../actions/view/view.actions';
import { BackupViewComponentState } from './save-view.state';
import { Grids, ViewComponentStateModel, ViewInterfaceButton, ViewInterfaceMaps, ViewLayouts } from '../../../../../shared/interface/view.interface';
import { activeChiamata, activeComposizione, colorButton, switchComposizione, turnOffComposizione, updateView, viewStateMaps } from '../../helper/view-state-function';
import { TerminaComposizione } from '../../actions/composizione-partenza/richiesta-composizione.actions';
import { GetInitCentroMappa, SetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';

export const ViewComponentStateDefault: ViewComponentStateModel = {
    view: {
        richieste: {
            active: true,
            split: true,
        },
        mappa: {
            active: true,
            split: true,
            options: [AppFeatures.Richieste]
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
        }
    },
    column: {
        sinistra: Grid.Col6,
        destra: Grid.Col6
    }
};

@State<ViewComponentStateModel>({
    name: 'viewComponent',
    defaults: ViewComponentStateDefault
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
    static colorButton(state: ViewComponentStateModel): ViewInterfaceButton {
        return colorButton(state);
    }

    @Selector()
    static viewStateMaps(state: ViewComponentStateModel): ViewInterfaceMaps {
        return viewStateMaps(state);
    }

    @Action(ChangeView)
    changeView({ getState, patchState }: StateContext<ViewComponentStateModel>, action: ChangeView) {
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
    toggleChiamata({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>, action: ToggleChiamata) {
        const state = getState();
        const stateDefault = makeCopy(ViewComponentStateDefault);
        /**
         * se lo stato della chiamata non è attivo creo uno snapshot, altrimenti ritorno allo stato precedente
         */
        if (!state.view.chiamata.active && !action.toggle) {
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
            dispatch(new GetInitCentroMappa());
        }
    }

    @Action(ToggleComposizione)
    toggleComposizione({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>, action: ToggleComposizione) {
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
    turnOffComposizione({ getState, patchState, dispatch }: StateContext<ViewComponentStateModel>) {
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
    switchComposizione({ getState, patchState }: StateContext<ViewComponentStateModel>, action: SwitchComposizione) {
        const state = getState();
        const currentState = makeCopy(state);
        const newState = switchComposizione(currentState, action.modalita);
        patchState({
            ...state,
            view: newState.view,
            column: newState.column
        });
    }

}
