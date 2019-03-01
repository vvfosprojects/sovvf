import { Action, Selector, State, StateContext, NgxsOnInit } from '@ngxs/store';

// Interface
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

// Action
import { GetPreAccoppiati } from '../../actions/composizione-partenza/pre-accoppiati.actions';

// Service
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';

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

    constructor(private preAccoppiatiService: CompPartenzaService) { }

    @Action(GetPreAccoppiati)
    getPreAccoppiati({ getState, patchState }: StateContext<PreAccoppiatiStateModel>) {
        const state = getState();

        this.preAccoppiatiService.getPreAccoppiati().subscribe((p: BoxPartenza[]) => {
            patchState({
                ...state,
                preAccoppiati: p
            });
        });

    }
}
