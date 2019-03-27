import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { SetChiamata, InsertChiamata, ReducerSchedaTelefonata, ResetChiamata, CestinaChiamata, SetMarkerChiamata, ClearChiamata } from '../../actions/chiamata/scheda-telefonata.actions';
import { FormChiamataModel } from '../../../chiamata/model/form-scheda-telefonata.model';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import { CopyToClipboard } from '../../actions/chiamata/clipboard.actions';
import { ToggleChiamata } from '../../actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { SignalRService } from '../../../../../core/signalr/signalR.service';
import { Observable } from 'rxjs';
import { UtenteState } from '../../../../navbar/store/states/operatore/utente.state';
import { Utente } from '../../../../../shared/model/utente.model';
import { GetMarkerDatiMeteo } from '../../actions/maps/marker-info-window.actions';
import { SignalRNotification } from '../../../../../core/signalr/model/signalr-notification.model';

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

    constructor(private signalR: SignalRService) {
    }

    @Select(UtenteState.utente) utente$: Observable<Utente>;

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
        patchState({
            coordinate: coordinate,
            chiamataMarker: [action.marker]
        });
    }

    @Action(ClearChiamata)
    clearChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>) {
        patchState(SchedaTelefonataStateDefaults);
    }

}
