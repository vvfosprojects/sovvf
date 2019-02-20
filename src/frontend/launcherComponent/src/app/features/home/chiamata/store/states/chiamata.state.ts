import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ChiamataService } from '../../../../../core/service/chiamata-service/chiamata.service';
import { FetchIdChiamata, SetIdChiamata } from '../actions/chiamata.actions';

export interface ChiamataStateModel {
    idChiamata: string;
}

export const ChiamataStateDefaults: ChiamataStateModel = {
    idChiamata: null
};

@State<ChiamataStateModel>({
    name: 'chiamata',
    defaults: ChiamataStateDefaults
})

export class ChiamataState {

    constructor(private chiamataService: ChiamataService) {
    }

    @Selector()
    static idChiamata(state: ChiamataStateModel) {
        return state.idChiamata;
    }

    @Action(FetchIdChiamata)
    getIdChiamata({ dispatch }: StateContext<ChiamataStateModel>) {
        this.chiamataService.getIdChiamata().subscribe((id: string) => {
            dispatch(new SetIdChiamata(id));
        });
    }

    @Action(SetIdChiamata)
    setIdChiamata({ getState, patchState }: StateContext<ChiamataStateModel>, action: SetIdChiamata) {
        const state = getState();

        patchState({
            ...state,
            idChiamata: action.payload
        });
    }
}
