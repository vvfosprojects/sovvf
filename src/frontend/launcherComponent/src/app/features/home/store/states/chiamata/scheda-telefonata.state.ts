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
import { ClipboardState } from './clipboard.state';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export interface SchedaTelefonataStateModel {
    coordinate: Coordinate;
    nuovaRichiesta: SintesiRichiesta;
    idChiamataMarker: string;
}

export const SchedaTelefonataStateDefaults: SchedaTelefonataStateModel = {
    coordinate: null,
    nuovaRichiesta: null,
    idChiamataMarker: null
};

@State<SchedaTelefonataStateModel>({
    name: 'schedaTelefonata',
    defaults: SchedaTelefonataStateDefaults,
    children: [ClipboardState]
})

export class SchedaTelefonataState {

    constructor(private signalR: SignalRService) {
    }

    @Select(UtenteState.utente) utente$: Observable<Utente>;

    @Action(ReducerSchedaTelefonata)
    reducer({getState, dispatch}: StateContext<SchedaTelefonataStateModel>, action: ReducerSchedaTelefonata) {
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
                dispatch(new SetChiamata(action.schedaTelefonata.nuovaRichiesta));
                break;
            default:
                return;
        }
    }

    @Action(SetChiamata)
    setChiamata({patchState, dispatch}: StateContext<SchedaTelefonataStateModel>, action: SetChiamata) {
        patchState({
            nuovaRichiesta: action.nuovaRichiesta
        });
        dispatch(new InsertChiamata());
    }

    @Action(InsertChiamata)
    insertChiamata({getState}: StateContext<SchedaTelefonataStateModel>) {
        const state = getState();
        this.utente$.subscribe((utente: Utente) => {
            if (utente) {
                this.signalR.insertChiamata(new SignalRNotification(
                    state.nuovaRichiesta.operatore.sede.codice,
                    state.nuovaRichiesta.operatore.id,
                    `${utente.cognome} ${utente.nome}`,
                    state.nuovaRichiesta
                ));
                console.dir(state.nuovaRichiesta);
            } else {
                console.error('Errore utente non connesso');
            }
        });
    }

    @Action(ResetChiamata)
    resetChiamata({dispatch}: StateContext<SchedaTelefonataStateModel>) {
        dispatch(new ClearChiamata());
        dispatch(new GetInitCentroMappa());
    }

    @Action(CestinaChiamata)
    cestinaChiamata({dispatch}: StateContext<SchedaTelefonataStateModel>) {
        dispatch(new ToggleChiamata());
    }

    @Action(SetMarkerChiamata)
    setMarkerChiamata({patchState, dispatch}: StateContext<SchedaTelefonataStateModel>, action: SetMarkerChiamata) {
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
    clearMarkerChiamata({getState, dispatch}: StateContext<SchedaTelefonataStateModel>) {
        dispatch(new RemoveChiamataMarker(getState().idChiamataMarker));
    }

    @Action(ClearChiamata)
    clearChiamata({patchState}: StateContext<SchedaTelefonataStateModel>) {
        patchState(SchedaTelefonataStateDefaults);
    }

}
