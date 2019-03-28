import { Action, Select, State, StateContext } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import {
    SetChiamata,
    InsertChiamata,
    ReducerSchedaTelefonata,
    ResetChiamata,
    CestinaChiamata,
    SetMarkerChiamata,
    ClearChiamata,
    ClearMarkerChiamata
} from '../../actions/chiamata/scheda-telefonata.actions';
import { FormChiamataModel } from '../../../chiamata/model/form-scheda-telefonata.model';
import { CopyToClipboard } from '../../actions/chiamata/clipboard.actions';
import { ToggleChiamata } from '../../actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { SignalRService } from '../../../../../core/signalr/signalR.service';
import { Observable } from 'rxjs';
import { UtenteState } from '../../../../navbar/store/states/operatore/utente.state';
import { Utente } from '../../../../../shared/model/utente.model';
import { GetMarkerDatiMeteo } from '../../actions/maps/marker-info-window.actions';
import { SignalRNotification } from '../../../../../core/signalr/model/signalr-notification.model';
import { InsertChiamataMarker, RemoveChiamataMarker } from '../../actions/maps/chiamate-markers.actions';

export interface SchedaTelefonataStateModel {
    coordinate: Coordinate;
    chiamata: FormChiamataModel;
    idChiamataMarker: string;
}

export const SchedaTelefonataStateDefaults: SchedaTelefonataStateModel = {
    coordinate: null,
    chiamata: null,
    idChiamataMarker: null
};

@State<SchedaTelefonataStateModel>({
    name: 'schedaTelefonata',
    defaults: SchedaTelefonataStateDefaults
})

export class SchedaTelefonataState {

    constructor(private signalR: SignalRService) {
    }

    @Select(UtenteState.utente) utente$: Observable<Utente>;

    @Action(ReducerSchedaTelefonata)
    reducer({ getState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: ReducerSchedaTelefonata) {
        switch (action.schedaTelefonata.tipo) {
            case 'copiaIndirizzo':
                dispatch(new CopyToClipboard(getState().coordinate));
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
        this.utente$.subscribe((utente: Utente) => {
            if (utente) {
                this.signalR.insertChiamata(new SignalRNotification(
                    state.chiamata.idSede,
                    state.chiamata.idOperatore,
                    `${utente.cognome} ${utente.nome}`,
                    state.chiamata
                ));
                console.dir(state.chiamata);
            } else {
                console.error('Errore utente non connesso');
            }
        });
    }

    @Action(ResetChiamata)
    resetChiamata({ dispatch }: StateContext<SchedaTelefonataStateModel>) {
        dispatch(new ClearChiamata());
        dispatch(new GetInitCentroMappa());
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ dispatch }: StateContext<SchedaTelefonataStateModel>) {
        dispatch(new ToggleChiamata());
    }

    @Action(SetMarkerChiamata)
    setMarkerChiamata({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetMarkerChiamata) {
        const coordinate: Coordinate = {
            latitudine: action.marker.localita.coordinate.latitudine,
            longitudine: action.marker.localita.coordinate.longitudine
        };
        dispatch(new GetMarkerDatiMeteo('chiamata-' + action.marker.id, coordinate));
        dispatch(new SetCoordCentroMappa(coordinate));
        dispatch(new SetZoomCentroMappa(18));
        dispatch(new InsertChiamataMarker(action.marker, true));
        patchState({
            coordinate: coordinate,
            idChiamataMarker: action.marker.id
        });
    }

    @Action(ClearMarkerChiamata)
    clearMarkerChiamata({ getState, dispatch }: StateContext<SchedaTelefonataStateModel>) {
        dispatch(new RemoveChiamataMarker(getState().idChiamataMarker));
    }

    @Action(ClearChiamata)
    clearChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>) {
        patchState(SchedaTelefonataStateDefaults);
    }

}
