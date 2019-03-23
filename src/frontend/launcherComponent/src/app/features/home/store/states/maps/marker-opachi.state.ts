import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearMarkerOpachiMezzi, ClearMarkerOpachiRichieste, SetMarkerOpachiMezzi, SetMarkerOpachiRichieste } from '../../actions/maps/marker-opachi.actions';

export interface MarkerOpachiStateModel {
    markerOpachiId: {
        richiesteId: string[];
        mezziId: string[];
        sediId: string[];
    }
    stato: {
        richieste: boolean;
        mezzi: boolean;
        sedi: boolean;
    }
}

export const MarkerOpachiStateDefaults: MarkerOpachiStateModel = {
    markerOpachiId: {
        richiesteId: [],
        mezziId: [],
        sediId: []
    },
    stato: {
        richieste: false,
        mezzi: false,
        sedi: false
    }
};

@State<MarkerOpachiStateModel>({
    name: 'markerOpachi',
    defaults: MarkerOpachiStateDefaults
})
export class MarkerOpachiState {

    @Selector()
    static markerOpachi(state: MarkerOpachiStateModel) {
        return state;
    }

    constructor() {

    }

    @Action(SetMarkerOpachiRichieste)
    setMarkerOpachiRichieste({ getState, setState }: StateContext<MarkerOpachiStateModel>, action: SetMarkerOpachiRichieste) {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                richiesteId: action.payload,
                mezziId: state.markerOpachiId.mezziId,
                sediId: state.markerOpachiId.sediId
            },
            stato: {
                richieste: true,
                mezzi: state.stato.mezzi,
                sedi: state.stato.sedi
            }
        });
    }

    @Action(ClearMarkerOpachiRichieste)
    clearMarkerOpachiRichieste({ getState, setState }: StateContext<MarkerOpachiStateModel>) {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                richiesteId: [],
                mezziId: state.markerOpachiId.mezziId,
                sediId: state.markerOpachiId.sediId
            },
            stato: {
                richieste: false,
                mezzi: state.stato.mezzi,
                sedi: state.stato.sedi
            }
        });
    }

    @Action(SetMarkerOpachiMezzi)
    setMarkerOpachiMezzi({ getState, setState }: StateContext<MarkerOpachiStateModel>, action: SetMarkerOpachiMezzi) {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                richiesteId: state.markerOpachiId.richiesteId,
                mezziId: action.payload,
                sediId: state.markerOpachiId.sediId
            },
            stato: {
                richieste: state.stato.richieste,
                mezzi: true,
                sedi: state.stato.sedi
            }
        });
    }

    @Action(ClearMarkerOpachiMezzi)
    clearMarkerOpachiMezzi({ getState, setState }: StateContext<MarkerOpachiStateModel>) {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                richiesteId: state.markerOpachiId.richiesteId,
                mezziId: [],
                sediId: state.markerOpachiId.sediId
            },
            stato: {
                richieste: state.stato.richieste,
                mezzi: false,
                sedi: state.stato.sedi
            }
        });
    }
}
