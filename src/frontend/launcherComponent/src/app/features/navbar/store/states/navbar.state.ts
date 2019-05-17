import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearDataNavbar, GetDataNavbar, SetDataNavbar } from '../actions/navbar.actions';
import { ShowToastr } from '../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../shared/enum/toastr';
import { NavbarService } from '../../../../core/service/navbar-service/navbar.service';
import { TipologieInterface } from '../../../../shared/interface/tipologie';
import { ListaSedi } from '../../../../shared/interface/lista-sedi';

export interface NavbarStateModel {
    loaded: boolean;
    listaSedi: ListaSedi;
    tipologie: TipologieInterface[];
}

export const NavbarStateDefaults: NavbarStateModel = {
    loaded: false,
    listaSedi: null,
    tipologie: null
};

@State<NavbarStateModel>({
    name: 'navbar',
    defaults: NavbarStateDefaults
})
export class NavbarState {

    @Selector()
    static tipologie(state: NavbarStateModel) {
        return state.tipologie;
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
        console.log('chiamo il controller della navbar');
        this.navbarService.getNavbar().subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));

    }

    @Action(SetDataNavbar)
    setDataNavbar({ patchState, dispatch }: StateContext<NavbarStateModel>, action: SetDataNavbar) {
        patchState({
            tipologie: action.settings.tipologie,
            listaSedi: action.settings.listaSedi,
            loaded: true
        });
    }

}
