import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataNavbar, GetDataNavbar, SetDataNavbar, ToggleSidebarOpened } from '../actions/navbar.actions';
import { NavbarService } from '../../../../core/service/navbar-service/navbar.service';
import { ListaSedi } from '../../../../shared/interface/lista-sedi';
import { SetListaSediTreeview } from '../../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { AppSettings } from '../../../../shared/interface/app-settings.interface';
import { SetRuoliUtenteLoggato } from '../../../../shared/store/actions/ruoli/ruoli.actions';
import { Injectable } from '@angular/core';
import { StartBigLoading, StopBigLoading } from '../../../../shared/store/actions/loading/loading.actions';
import { SetInitCentroMappa } from '../../../maps/store/actions/centro-mappa.actions';
import { SetMapLoaded } from '../../../../shared/store/actions/app/app.actions';
import { SetCurrentPswEsri, SetCurrentUserEsri } from '../../../auth/store/auth.actions';

export interface NavbarStateModel {
    loaded: boolean;
    listaSedi: ListaSedi;
    sidebarOpened: boolean;
}

export const NavbarStateDefaults: NavbarStateModel = {
    loaded: false,
    listaSedi: null,
    sidebarOpened: false
};

@Injectable()
@State<NavbarStateModel>({
    name: 'navbar',
    defaults: NavbarStateDefaults
})
export class NavbarState {

    @Selector()
    static listaSedi(state: NavbarStateModel): ListaSedi {
        return state.listaSedi;
    }

    @Selector()
    static navbarIsLoaded(state: NavbarStateModel): boolean {
        return state.loaded;
    }

    @Selector()
    static sidebarOpened(state: NavbarStateModel): boolean {
        return state.sidebarOpened;
    }

    constructor(private navbarService: NavbarService) {
    }

    @Action(GetDataNavbar)
    getDataNavbar({ dispatch }: StateContext<NavbarStateModel>): void {
        dispatch(new StartBigLoading());
        this.navbarService.getNavbar().subscribe((data: AppSettings) => {
            dispatch(new SetDataNavbar(data));
            dispatch(new StopBigLoading());
        });
    }

    @Action(SetDataNavbar)
    setDataNavbar({ patchState, dispatch }: StateContext<NavbarStateModel>, action: SetDataNavbar): void {
        patchState({
            listaSedi: action.settings.listaSedi,
            loaded: true
        });
        dispatch([
            new SetRuoliUtenteLoggato(action.settings.utente.ruoli),
            new SetListaSediTreeview(action.settings.listaSedi),
            new SetInitCentroMappa(action.settings.centroMappaMarker),
            new SetCurrentPswEsri(action.settings.pwESRI),
            new SetCurrentUserEsri(action.settings.userESRI)
        ]);
    }

    @Action(ClearDataNavbar)
    clearDataNavbar({ patchState, dispatch }: StateContext<NavbarStateModel>): void {
        patchState(NavbarStateDefaults);
        dispatch([
            new SetMapLoaded(false)
        ]);
    }

    @Action(ToggleSidebarOpened)
    toggleSidebarOpened({ getState, patchState }: StateContext<NavbarStateModel>, action: ToggleSidebarOpened): void {
        patchState({
            sidebarOpened: action.value
        });
    }

}
