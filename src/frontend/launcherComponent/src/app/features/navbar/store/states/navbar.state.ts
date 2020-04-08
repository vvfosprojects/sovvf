import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataNavbar, GetDataNavbar, SetDataNavbar } from '../actions/navbar.actions';
import { ShowToastr } from '../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../shared/enum/toastr';
import { NavbarService } from '../../../../core/service/navbar-service/navbar.service';
import { ListaSedi } from '../../../../shared/interface/lista-sedi';
import { SetListaSediTreeview } from '../../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { AppSettings } from '../../../../shared/interface/app-settings.interface';
import { SetRuoliUtenteLoggato } from '../../../../shared/store/actions/ruoli/ruoli.actions';

export interface NavbarStateModel {
    loaded: boolean;
    listaSedi: ListaSedi;
}

export const NavbarStateDefaults: NavbarStateModel = {
    loaded: false,
    listaSedi: null,
};

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
        this.navbarService.getNavbar().subscribe((data: AppSettings) => {
            dispatch(new SetDataNavbar(data));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetDataNavbar)
    setDataNavbar({ patchState, dispatch }: StateContext<NavbarStateModel>, action: SetDataNavbar) {
        patchState({
            listaSedi: action.settings.listaSedi,
            loaded: true
        });
        dispatch(new SetRuoliUtenteLoggato(action.settings.ruoliUtLoggato));
        dispatch(new SetListaSediTreeview(action.settings.listaSedi));
    }

}
