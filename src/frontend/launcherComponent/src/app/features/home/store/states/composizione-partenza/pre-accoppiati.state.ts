import { Action, Selector, State, StateContext } from '@ngxs/store';

// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

// Action
import { GetPreAccoppiati, SetPreAccoppiati } from '../../actions/composizione-partenza/pre-accoppiati.actions';

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';

export interface PreAccoppiatiStateModel {
    preAccoppiati: BoxPartenza[];
}

export const PreAccoppiatiStateModelStateDefaults: PreAccoppiatiStateModel = {
    preAccoppiati: []
};

@State<PreAccoppiatiStateModel>({
    name: 'preAccoppiati',
    defaults: PreAccoppiatiStateModelStateDefaults
})
export class PreAccoppiatiState {

    // SELECTORS
    @Selector()
    static preAccoppiati(state: PreAccoppiatiStateModel) {
        return state.preAccoppiati;
    }

    constructor(private preAccoppiatiService: CompPartenzaService) {
    }

    @Action(GetPreAccoppiati)
    getPreAccoppiati({ dispatch }: StateContext<PreAccoppiatiStateModel>) {
        this.preAccoppiatiService.getPreAccoppiati().subscribe((p: BoxPartenza[]) => {
            dispatch(new SetPreAccoppiati(p));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetPreAccoppiati)
    setPreAccoppiati({ patchState }: StateContext<PreAccoppiatiStateModel>, action: SetPreAccoppiati) {
        patchState({
            preAccoppiati: action.boxPartenza
        });
    }
}
