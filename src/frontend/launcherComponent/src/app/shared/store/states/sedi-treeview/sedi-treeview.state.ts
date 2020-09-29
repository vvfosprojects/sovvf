import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ListaSedi } from '../../../interface/lista-sedi';
import {
    ClearListaSediNavbar,
    ClearSediNavbarSelezionate,
    PatchListaSediNavbar,
    PatchSediNavbarSelezionate,
    SetListaSediTreeview,
    SetSediNavbarSelezionate, SetSediNavbarVisible
} from '../../actions/sedi-treeview/sedi-treeview.actions';
import { arraysEqual, makeCopy } from '../../../helper/function';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { allFalseTreeItem, checkTreeItem, findItem } from './sedi-treeview.helper';
import { ReloadApp, SetVistaSedi } from '../../actions/app/app.actions';
import { ToastrType } from '../../../enum/toastr';
import { SetTurnoCalendario } from 'src/app/features/navbar/store/actions/turno.actions';
import { LSNAME } from '../../../../core/settings/config';

export interface SediTreeviewStateModel {
    listeSedi: ListaSedi;
    listaSediNavbar: ListaSedi;
    sediNavbarTesto: TreeViewStateSelezione;
    sediNavbarSelezionate: TreeViewStateSelezioneArr;
    sediNavbarVisible: boolean;
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
    sediNavbarVisible: true
};

@State<SediTreeviewStateModel>({
    name: 'listaSediTreeview',
    defaults: SediTreeviewStateDefaults
})
export class SediTreeviewState {

    @Selector()
    static listeSediLoaded(state: SediTreeviewStateModel) {
        return !!state.listeSedi;
    }

    @Selector()
    static listeSediNavbarLoaded(state: SediTreeviewStateModel) {
        return !!state.listaSediNavbar;
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
    static sediNavbarVisible(state: SediTreeviewStateModel) {
        return state.sediNavbarVisible;
    }

    @Selector()
    static sediNavbarTastoConferma(state: SediTreeviewStateModel): boolean {
        const sediNavbar = state.sediNavbarSelezionate;
        if (sediNavbar.correnti as string[] && sediNavbar.correnti.length > 0) {
            return arraysEqual(sediNavbar.iniziali, sediNavbar.correnti);
        } else {
            return true;
        }
    }

    @Action(SetListaSediTreeview)
    setListaSediTreeview({ patchState }: StateContext<SediTreeviewStateModel>, action: SetListaSediTreeview) {
        patchState({
            listeSedi: action.listaSedi
        });
    }

    @Action(PatchListaSediNavbar)
    patchListaSediNavbar({ getState, patchState }: StateContext<SediTreeviewStateModel>, action: PatchListaSediNavbar) {
        const cS: any = sessionStorage.getItem(LSNAME.cacheSedi);
        if ( action.selected && cS)  {
            action.selected = [cS];
        }
        const state = getState();
        if (state.listeSedi) {
            const listeChecked = makeCopy(state.listeSedi);
            allFalseTreeItem(listeChecked);
            if (action.selected) {
                checkTreeItem(listeChecked, action.selected);
            }
            patchState({
                listaSediNavbar: listeChecked
            });
        }
    }

    @Action(ClearListaSediNavbar)
    clearListaSediNavbar({ patchState }: StateContext<SediTreeviewStateModel>) {
        patchState({
            listaSediNavbar: SediTreeviewStateDefaults.listaSediNavbar,
            sediNavbarTesto: SediTreeviewStateDefaults.sediNavbarTesto,
            sediNavbarSelezionate: SediTreeviewStateDefaults.sediNavbarSelezionate
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
                }
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
            }
        });
        dispatch(new ShowToastr(ToastrType.Warning, 'Attenzione', 'Selezione della sede annullata', 5));
    }

    @Action(SetSediNavbarSelezionate)
    setSediNavbarSelezionate({ getState, patchState, dispatch }: StateContext<SediTreeviewStateModel>) {
        console.clear();
        const state = getState();
        patchState({
            sediNavbarSelezionate: {
                iniziali: state.sediNavbarSelezionate.correnti,
            },
            sediNavbarTesto: {
                iniziale: state.sediNavbarTesto.corrente,
            }
        });
        dispatch([
            new SetVistaSedi(state.sediNavbarSelezionate.correnti),
            new SetTurnoCalendario(),
            new ReloadApp()
        ]);
    }

    @Action(SetSediNavbarVisible)
    setSediNavbarVisible({ patchState }: StateContext<SediTreeviewStateModel>, { sediNavbarVisible }: SetSediNavbarVisible) {
        patchState({ sediNavbarVisible });
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
