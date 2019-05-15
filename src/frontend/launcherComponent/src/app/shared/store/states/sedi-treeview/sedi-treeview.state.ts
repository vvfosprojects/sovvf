import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ListaSedi } from '../../../../core/settings/lista-sedi';
import {
    ClearListaSediNavbar,
    ClearSediNavbarSelezionate,
    PatchListaSediNavbar,
    PatchSediNavbarSelezionate,
    SetListaSediTreeview,
    SetSediNavbarSelezionate
} from '../../actions/sedi-treeview/sedi-treeview.actions';
import { arraysEqual, makeCopy } from '../../../helper/function';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { allFalseTreeItem, checkTreeItem, findItem } from './sedi-treeview.helper';
import { SetAppLoaded } from '../../actions/app/app.actions';
import { SetTurno } from '../../../../features/navbar/store/actions/turno/turno.actions';
import { ToastrType } from '../../../enum/toastr';

export interface SediTreeviewStateModel {
    listeSedi: ListaSedi;
    listaSediNavbar: ListaSedi;
    sediNavbarTesto: TreeViewStateSelezione;
    sediNavbarSelezionate: TreeViewStateSelezioneArr;
    sediNavbarDisableConfirm: boolean;
}

export const SediTreeviewStateDefaults: SediTreeviewStateModel = {
    listeSedi: null,
    listaSediNavbar: null,
    sediNavbarTesto: {
        iniziale: 'nessuna sede selezionata'
    },
    sediNavbarSelezionate: {
        iniziali: null,
    },
    sediNavbarDisableConfirm: true
};

@State<SediTreeviewStateModel>({
    name: 'listaSediTreeview',
    defaults: SediTreeviewStateDefaults
})
export class SediTreeviewState {

    @Selector()
    static listeSedi(state: SediTreeviewStateModel) {
        return state.listeSedi;
    }

    @Selector()
    static listeSediNavbar(state: SediTreeviewStateModel) {
        return state.listaSediNavbar;
    }

    @Selector()
    static sediNavbarTesto(state: SediTreeviewStateModel) {
        return state.sediNavbarTesto.iniziale;
    }

    @Selector()
    static sediNavbarTastoConferma(state: SediTreeviewStateModel) {
        return state.sediNavbarDisableConfirm;
    }

    @Action(SetListaSediTreeview)
    setListaSediTreeview({ patchState }: StateContext<SediTreeviewStateModel>, action: SetListaSediTreeview) {
        allFalseTreeItem(action.listaSedi);
        patchState({
            listeSedi: action.listaSedi
        });
    }

    @Action(PatchListaSediNavbar)
    patchListaSediNavbar({ getState, patchState }: StateContext<SediTreeviewStateModel>, action: PatchListaSediNavbar) {
        const listeChecked = makeCopy(getState().listeSedi);
        checkTreeItem(listeChecked, action.selected);
        patchState({
            listaSediNavbar: listeChecked
        });
    }

    @Action(ClearListaSediNavbar)
    clearListaSediNavbar({ patchState }: StateContext<SediTreeviewStateModel>) {
        patchState({
            sediNavbarTesto: SediTreeviewStateDefaults.sediNavbarTesto,
            sediNavbarSelezionate: SediTreeviewStateDefaults.sediNavbarSelezionate,
            sediNavbarDisableConfirm: SediTreeviewStateDefaults.sediNavbarDisableConfirm,
        });
    }

    @Action(PatchSediNavbarSelezionate)
    patchSediNavbarSelezionate({ getState, patchState, dispatch }: StateContext<SediTreeviewStateModel>, action: PatchSediNavbarSelezionate) {
        const state = getState();
        let item = '';
        if (action.selected[0]) {
            if (!action.multi) {
                item = findItem(state.listaSediNavbar, action.selected[0]).text;
            } else {
                item = 'più sedi selezionate';
            }
        } else {
            item = 'nessuna sede selezionata';
            action.selected = [];
        }
        if (!state.sediNavbarSelezionate.iniziali) {
            patchState({
                sediNavbarSelezionate: {
                    iniziali: action.selected
                },
                sediNavbarTesto: {
                    iniziale: item
                }
            });
        } else {
            patchState({
                sediNavbarSelezionate: {
                    iniziali: state.sediNavbarSelezionate.iniziali,
                    correnti: action.selected
                },
                sediNavbarTesto: {
                    iniziale: state.sediNavbarTesto.iniziale,
                    corrente: item,
                },
                sediNavbarDisableConfirm: (!!arraysEqual(state.sediNavbarSelezionate.iniziali, action.selected) || action.selected.length === 0)
            });
        }
    }

    @Action(ClearSediNavbarSelezionate)
    clearSediNavbarSelezionate({ getState, patchState, dispatch }: StateContext<SediTreeviewStateModel>) {
        const state = getState();
        dispatch(new PatchListaSediNavbar(state.sediNavbarSelezionate.iniziali));
        patchState({
            sediNavbarSelezionate: {
                iniziali: state.sediNavbarSelezionate.iniziali,
                correnti: SediTreeviewStateDefaults.sediNavbarSelezionate.correnti
            },
            sediNavbarTesto: {
                iniziale: state.sediNavbarTesto.iniziale,
                corrente: SediTreeviewStateDefaults.sediNavbarTesto.corrente
            },
            sediNavbarDisableConfirm: SediTreeviewStateDefaults.sediNavbarDisableConfirm
        });
        dispatch(new ShowToastr(ToastrType.Warning, 'Attenzione', 'Selezione della sede annullata', 5));
    }

    @Action(SetSediNavbarSelezionate)
    setSediNavbarSelezionate({ getState, patchState, dispatch }: StateContext<SediTreeviewStateModel>) {
        const state = getState();
        patchState({
            sediNavbarSelezionate: {
                iniziali: state.sediNavbarSelezionate.correnti,
                correnti: SediTreeviewStateDefaults.sediNavbarSelezionate.correnti
            },
            sediNavbarTesto: {
                iniziale: state.sediNavbarTesto.corrente,
                corrente: SediTreeviewStateDefaults.sediNavbarTesto.corrente
            },
            sediNavbarDisableConfirm: SediTreeviewStateDefaults.sediNavbarDisableConfirm
        });
        dispatch(new SetTurno());
        dispatch(new SetAppLoaded());
    }

}

export interface TreeViewStateSelezione {
    iniziale: string;
    corrente?: string;
}

export interface TreeViewStateSelezioneArr {
    iniziali: string[];
    correnti?: string[];
}
