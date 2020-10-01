import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataNavbar, GetDataNavbar, SetDataNavbar } from '../actions/navbar.actions';
import { NavbarService } from '../../../../core/service/navbar-service/navbar.service';
import { ListaSedi } from '../../../../shared/interface/lista-sedi';
import { SetListaSediTreeview } from '../../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { AppSettings } from '../../../../shared/interface/app-settings.interface';
import { SetRuoliUtenteLoggato } from '../../../../shared/store/actions/ruoli/ruoli.actions';
import { Injectable } from '@angular/core';
import { StartBigLoading } from '../../../../shared/store/actions/loading/loading.actions';

export interface NavbarStateModel {
    loaded: boolean;
    listaSedi: ListaSedi;
}

export const NavbarStateDefaults: NavbarStateModel = {
    loaded: false,
    listaSedi: null,
};

@Injectable()
@State<NavbarStateModel>({
    name: 'navbar',
    defaults: NavbarStateDefaults
})
export class NavbarState {

    @Selector()
    static listaSedi(state: NavbarStateModel) {
        return state.listaSedi;
    }

    @Selector()
    static navbarIsLoaded(state: NavbarStateModel) {
        return state.loaded;
    }

    constructor(private navbarService: NavbarService) {
    }

    @Action(ClearDataNavbar)
    clearDataNavbar({ patchState }: StateContext<NavbarStateModel>) {
        patchState(NavbarStateDefaults);
    }

    @Action(GetDataNavbar)
    getDataNavbar({ dispatch }: StateContext<NavbarStateModel>) {
        dispatch(new StartBigLoading());
        this.navbarService.getNavbar().subscribe((data: AppSettings) => {
            dispatch(new SetDataNavbar(data));
        });
    }

    @Action(SetDataNavbar)
    setDataNavbar({ patchState, dispatch }: StateContext<NavbarStateModel>, action: SetDataNavbar) {
        patchState({
            listaSedi: action.settings.listaSedi,
            loaded: true
        });
        dispatch([
            new SetRuoliUtenteLoggato(action.settings.utente.ruoli),
            new SetListaSediTreeview(action.settings.listaSedi)
        ]);
    }

}
