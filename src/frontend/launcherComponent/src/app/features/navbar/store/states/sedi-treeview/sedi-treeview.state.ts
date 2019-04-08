import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { TreeItem } from 'ngx-treeview';
import {
    ClearSediNavbarSelezionate,
    GetListaSediTreeview,
    PatchListaSediNavbar,
    PatchSediNavbarSelezionate,
    SetListaSediTreeview,
    SetSediNavbarSelezionate
} from '../../actions/sedi-treeview/sedi-treeview.actions';
import { ListaSediService } from '../../../../../core/service/lista-sedi-service/lista-sedi.service';
import { arraysEqual, makeCopy } from '../../../../../shared/helper/function';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { allFalseTreeItem, checkTreeItem, findItem, Ricorsivo, sedeString } from './sedi-treeview.helper';
import { SetAppLoaded } from '../../../../../shared/store/actions/app/app.actions';

export interface SediTreeviewStateModel {
    listeSedi: TreeItem;
    listaSediNavbar: TreeItem;
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
export class SediTreeviewState implements NgxsOnInit {

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

    ngxsOnInit(ctx: StateContext<SediTreeviewStateModel>) {
        ctx.dispatch(new GetListaSediTreeview());
    }

    constructor(private _listaSedi: ListaSediService) {
    }

    @Action(GetListaSediTreeview)
    getListaSediTreeview({ dispatch }: StateContext<SediTreeviewStateModel>) {
        this._listaSedi.getListaSedi().subscribe((result: TreeItem) => {
            allFalseTreeItem(result);
            dispatch(new SetListaSediTreeview(result));
        });
    }

    @Action(SetListaSediTreeview)
    setListaSediTreeview({ patchState }: StateContext<SediTreeviewStateModel>, action: SetListaSediTreeview) {
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

    @Action(PatchSediNavbarSelezionate)
    patchSediNavbarSelezionate({ getState, patchState }: StateContext<SediTreeviewStateModel>, action: PatchSediNavbarSelezionate) {
        const state = getState();
        let item = '';
        if (action.options === Ricorsivo.Ricorsivo) {
            item = findItem(state.listaSediNavbar, action.selected[0]).text;
        } else {
            item = 'più sedi selezionate';
        }
        console.log(item);
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
                sediNavbarDisableConfirm: !!(arraysEqual(state.sediNavbarSelezionate.iniziali, action.selected) || action.selected.length === 0)
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
        dispatch(new ShowToastr('warning', 'Attenzione', 'Selezione della sede annullata', 5));
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
                iniziale: sedeString(state.sediNavbarTesto.corrente),
                corrente: SediTreeviewStateDefaults.sediNavbarTesto.corrente
            },
            sediNavbarDisableConfirm: SediTreeviewStateDefaults.sediNavbarDisableConfirm
        });
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
