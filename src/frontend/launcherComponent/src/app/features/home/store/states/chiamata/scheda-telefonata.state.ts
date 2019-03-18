import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { SetChiamata, InsertChiamata, ReducerSchedaTelefonata, ResetChiamata, CestinaChiamata, SetMarkerChiamata } from '../../actions/chiamata/scheda-telefonata.actions';
import { FormChiamataModel } from '../../../chiamata/model/form-scheda-telefonata.model';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import { CopyToClipboard } from '../../actions/chiamata/clipboard.actions';
import { ToggleChiamata } from '../../actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';

export interface SchedaTelefonataStateModel {
    coordinate: Coordinate;
    chiamata: FormChiamataModel;
    chiamataMarker: ChiamataMarker[];
}

export const SchedaTelefonataStateDefaults: SchedaTelefonataStateModel = {
    coordinate: null,
    chiamata: null,
    chiamataMarker: []
};

@State<SchedaTelefonataStateModel>({
    name: 'schedaTelefonata',
    defaults: SchedaTelefonataStateDefaults
})

export class SchedaTelefonataState {

    constructor() {
    }

    @Selector()
    static coordinate(state: SchedaTelefonataStateModel) {
        return state.coordinate;
    }

    @Selector()
    static chiamataMarker(state: SchedaTelefonataStateModel) {
        return state.chiamataMarker;
    }

    @Action(ReducerSchedaTelefonata)
    reducer({ dispatch }: StateContext<SchedaTelefonataStateModel>, action: ReducerSchedaTelefonata) {
        switch (action.schedaTelefonata.tipo) {
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
                dispatch(new SetMarkerChiamata(action.schedaTelefonata.markerChiamata));
                break;
            case 'inserita':
                dispatch(new SetChiamata(action.schedaTelefonata.formChiamata));
                dispatch(new ToggleChiamata(true));
                dispatch(new ResetChiamata());
                break;
            default:
                return;
        }
    }

    @Action(SetChiamata)
    setChiamata({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetChiamata) {
        patchState({
            chiamata: action.chiamata
        });
        dispatch(new InsertChiamata());
    }

    @Action(InsertChiamata)
    insertChiamata({ getState }: StateContext<SchedaTelefonataStateModel>) {
        const state = getState();
        console.log(`Chiamata inserita:`);
        console.dir(state.chiamata);
    }

    @Action(ResetChiamata)
    resetChiamata({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>) {
        patchState({
            chiamataMarker: []
        });
        dispatch(new GetInitCentroMappa());
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>) {
        patchState({
            chiamataMarker: []
        });
        dispatch(new ToggleChiamata());
    }

    @Action(SetMarkerChiamata)
    setMarkerChiamata({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetMarkerChiamata) {
        const coordinate: Coordinate = {
            latitudine: action.marker.localita.coordinate.latitudine,
            longitudine: action.marker.localita.coordinate.longitudine
        };
        // Todo: tolta DI markerServer, ma manca il meteo sulla chiamata.
        dispatch(new SetCoordCentroMappa(coordinate));
        dispatch(new SetZoomCentroMappa(18));
        // Todo: fare il dispatch dell'action di signalR - NotifyMarkerChiamata
        patchState({
            coordinate: coordinate,
            chiamataMarker: [action.marker]
        });

    }

}
