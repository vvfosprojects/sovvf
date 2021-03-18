import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ClearMarkerOpachiMezzi,
    ClearMarkerOpachiRichieste,
    ClearMarkerOpachiSC,
    SetMarkerOpachiMezzi,
    SetMarkerOpachiRichieste,
    SetMarkerOpachiSC
} from '../../actions/maps/marker-opachi.actions';
import { Injectable } from '@angular/core';

export interface MarkerOpachiStateModel {
    markerOpachiId: {
        richiesteId: string[];
        mezziId: string[];
        sediId: string[];
        schedeContattoId: string[];
    };
    stato: {
        richieste: boolean;
        mezzi: boolean;
        sedi: boolean;
        schedeContatto: boolean;
    };
}

export const MarkerOpachiStateDefaults: MarkerOpachiStateModel = {
    markerOpachiId: {
        richiesteId: [],
        mezziId: [],
        sediId: [],
        schedeContattoId: []
    },
    stato: {
        richieste: false,
        mezzi: false,
        sedi: false,
        schedeContatto: false
    }
};

@Injectable()
@State<MarkerOpachiStateModel>({
    name: 'markerOpachi',
    defaults: MarkerOpachiStateDefaults
})
export class MarkerOpachiState {

    @Selector()
    static markerOpachi(state: MarkerOpachiStateModel): MarkerOpachiStateModel {
        return state;
    }

    @Action(SetMarkerOpachiRichieste)
    setMarkerOpachiRichieste({ getState, setState }: StateContext<MarkerOpachiStateModel>, action: SetMarkerOpachiRichieste): void {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                ...state.markerOpachiId,
                richiesteId: action.payload
            },
            stato: {
                ...state.stato,
                richieste: true
            }
        });
    }

    @Action(ClearMarkerOpachiRichieste)
    clearMarkerOpachiRichieste({ getState, setState }: StateContext<MarkerOpachiStateModel>): void {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                ...state.markerOpachiId,
                richiesteId: []
            },
            stato: {
                ...state.stato,
                richieste: false
            }
        });
    }

    @Action(SetMarkerOpachiMezzi)
    setMarkerOpachiMezzi({ getState, setState }: StateContext<MarkerOpachiStateModel>, action: SetMarkerOpachiMezzi): void {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                ...state.markerOpachiId,
                mezziId: action.payload
            },
            stato: {
                ...state.stato,
                mezzi: true
            }
        });
    }

    @Action(ClearMarkerOpachiMezzi)
    clearMarkerOpachiMezzi({ getState, setState }: StateContext<MarkerOpachiStateModel>): void {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                ...state.markerOpachiId,
                mezziId: []

            },
            stato: {
                ...state.stato,
                mezzi: false
            }
        });
    }

    @Action(SetMarkerOpachiSC)
    setMarkerOpachiSC({ getState, setState }: StateContext<MarkerOpachiStateModel>, action: SetMarkerOpachiSC): void {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                ...state.markerOpachiId,
                schedeContattoId: action.payload
            },
            stato: {
                ...state.stato,
                schedeContatto: true
            }
        });
    }

    @Action(ClearMarkerOpachiSC)
    clearMarkerOpachiSC({ getState, setState }: StateContext<MarkerOpachiStateModel>): void {
        const state = getState();
        setState({
            ...state,
            markerOpachiId: {
                ...state.markerOpachiId,
                schedeContattoId: []

            },
            stato: {
                ...state.stato,
                schedeContatto: false
            }
        });
    }

}
