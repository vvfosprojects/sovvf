import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { SetChiamata, InsertChiamata, SetCoordinate, ReducerSchedaTelefonata, ResetChiamata, CestinaChiamata } from '../actions/scheda-telefonata.actions';
import { FormChiamataModel } from '../../model/form-scheda-telefonata.model';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import { MarkerService } from '../../../maps/service/marker-service/marker-service.service';
import { MapsEvent } from '../../../../../shared/enum/maps-event.enum';
import { ChiamataState } from './chiamata.state';
import { CopyToClipboard } from '../actions/clipboard.actions';
import { ToggleChiamata } from '../../../store/actions/view.actions';

export interface SchedaTelefonataStateModel {
    coordinate: Coordinate;
    chiamata: FormChiamataModel;
    chiamataMarker: ChiamataMarker[];
    annulla: boolean; // Todo: togliere con MapsCenterState
}

export const SchedaTelefonataStateDefaults: SchedaTelefonataStateModel = {
    coordinate: null,
    chiamata: null,
    chiamataMarker: [],
    annulla: null // Todo: togliere con MapsCenterState
};

@State<SchedaTelefonataStateModel>({
    name: 'schedaTelefonata',
    defaults: SchedaTelefonataStateDefaults
})

export class SchedaTelefonataState {

    constructor(private store: Store,
                private markerService: MarkerService) {
    }

    @Selector()
    static coordinate(state: SchedaTelefonataStateModel) {
        return state.coordinate;
    }

    // Todo: togliere con MapsCenterState
    @Selector()
    static annullaChiamataMarker(state: SchedaTelefonataStateModel) {
        return state.annulla;
    }

    // Todo: togliere con MapsState
    @Selector()
    static chiamataMarker(state: SchedaTelefonataStateModel) {
        return state.chiamataMarker;
    }

    @Action(ReducerSchedaTelefonata)
    reducer({ dispatch }: StateContext<SchedaTelefonataStateModel>, action: ReducerSchedaTelefonata) {
        switch (action.schedaTelefonata.azione) {
            case 'copiaIndirizzo':
                dispatch(new CopyToClipboard());
                break;
            case 'annullata':
                dispatch(new CestinaChiamata());
                break;
            case 'reset':
                dispatch(new ResetChiamata());
                break;
            case 'cerca':
                dispatch(new SetCoordinate(action.schedaTelefonata.chiamata));
                break;
            case 'inserita':
                dispatch(new SetChiamata(action.schedaTelefonata.chiamata));
                break;
            default:
                return;
        }
    }

    @Action(SetChiamata)
    setChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetChiamata) {
        const state = getState();
        patchState({
            ...state,
            chiamata: action.chiamata
        });
        dispatch(new InsertChiamata());
    }

    @Action(InsertChiamata)
    insertChiamata({ getState }: StateContext<SchedaTelefonataStateModel>) {
        const state = getState();
        // Todo: servizio Post/SignalR che inserisce la chiamata
        console.log(`Chiamata inserita:`);
        console.dir(state.chiamata);
    }

    @Action(ResetChiamata)
    resetChiamata({ getState, patchState }: StateContext<SchedaTelefonataStateModel>) {
        const state = getState();
        patchState({
            ...state,
            chiamataMarker: []
        });
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>) {
        const state = getState();
        patchState({
            ...state,
            annulla: true,
            chiamataMarker: []
        });
        dispatch(new ToggleChiamata());
    }

    @Action(SetCoordinate)
    setCoordinate({ getState, patchState }: StateContext<SchedaTelefonataStateModel>, action: SetCoordinate) {
        const state = getState();

        const coordinate: Coordinate = {
            latitudine: action.chiamata.localita.coordinate.latitudine,
            longitudine: action.chiamata.localita.coordinate.longitudine
        };
        const idChiamata = this.store.selectSnapshot(ChiamataState.idChiamata);
        const marker = new ChiamataMarker(idChiamata, action.chiamata.localita);
        this.markerService.chiamata(marker, MapsEvent.Centra);

        patchState({
            ...state,
            coordinate: coordinate,
            chiamataMarker: [marker]
        });
    }

}
