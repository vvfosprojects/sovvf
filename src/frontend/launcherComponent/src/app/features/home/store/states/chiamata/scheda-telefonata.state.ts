import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { SetChiamata, InsertChiamata, ReducerSchedaTelefonata, ResetChiamata, CestinaChiamata, SetMarkerChiamata } from '../../actions/chiamata/scheda-telefonata.actions';
import { FormChiamataModel } from '../../../chiamata/model/form-scheda-telefonata.model';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import { MarkerService } from '../../../maps/service/marker-service/marker-service.service';
import { MapsEvent } from '../../../../../shared/enum/maps-event.enum';
import { CopyToClipboard } from '../../actions/chiamata/clipboard.actions';
import { ToggleChiamata } from '../../actions/view/view.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';

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

    constructor(private markerService: MarkerService) {
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
                /**
                 * azione al momento non utilizzata, perchè tutte le chiamate devono essere registrate,
                 * comprese quelle che non vanno a buon fine
                 */
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
    resetChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>) {
        const state = getState();
        patchState({
            ...state,
            chiamataMarker: []
        });
        dispatch(new GetInitCentroMappa());
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>) {
        const state = getState();
        patchState({
            ...state,
            chiamataMarker: []
        });
        dispatch(new ToggleChiamata());
    }

    @Action(SetMarkerChiamata)
    setMarkerChiamata({ getState, patchState }: StateContext<SchedaTelefonataStateModel>, action: SetMarkerChiamata) {
        const state = getState();
        const coordinate: Coordinate = {
            latitudine: action.marker.localita.coordinate.latitudine,
            longitudine: action.marker.localita.coordinate.longitudine
        };
        this.markerService.chiamata(action.marker, MapsEvent.Centra);

        patchState({
            ...state,
            coordinate: coordinate,
            chiamataMarker: [action.marker]
        });

    }

}
