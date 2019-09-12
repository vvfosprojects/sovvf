import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import {
    CestinaChiamata,
    ClearChiamata,
    ClearMarkerChiamata,
    InsertChiamata,
    InsertChiamataSuccess,
    MarkerChiamata,
    ReducerSchedaTelefonata,
    ResetChiamata,
    StartChiamata
} from '../../actions/chiamata/scheda-telefonata.actions';
import { CopyToClipboard } from '../../actions/chiamata/clipboard.actions';
import { ToggleChiamata } from '../../actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { GetMarkerDatiMeteo } from '../../actions/maps/marker-info-window.actions';
import { DelChiamataMarker, SetChiamataMarker, UpdateChiamataMarker } from '../../actions/maps/chiamate-markers.actions';
import { ClipboardState } from './clipboard.state';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../../../shared/enum/azione-chiamata.enum';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ChiamataService } from '../../../../../core/service/chiamata-service/chiamata.service';
import { AddRichiesta, SetIdChiamataInviaPartenza, StartInviaPartenzaFromChiamata } from '../../actions/richieste/richieste.actions';
import { environment } from '../../../../../../environments/environment';

export interface SchedaTelefonataStateModel {
    coordinate: Coordinate;
    nuovaRichiesta: SintesiRichiesta;
    azioneChiamata: AzioneChiamataEnum;
    idChiamataMarker: string;
    resetChiamata: boolean;
}

export const SchedaTelefonataStateDefaults: SchedaTelefonataStateModel = {
    coordinate: null,
    nuovaRichiesta: null,
    azioneChiamata: null,
    idChiamataMarker: null,
    resetChiamata: true
};

@State<SchedaTelefonataStateModel>({
    name: 'schedaTelefonata',
    defaults: SchedaTelefonataStateDefaults,
    children: [ClipboardState]
})

export class SchedaTelefonataState {

    constructor(private chiamataService: ChiamataService) {
    }

    @Selector()
    static resetChiamata(state: SchedaTelefonataStateModel) {
        return state.resetChiamata;
    }

    @Selector()
    static myChiamataMarker(state: SchedaTelefonataStateModel) {
        return state.idChiamataMarker;
    }

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
                dispatch(new MarkerChiamata(action.schedaTelefonata.markerChiamata));
                break;
            case 'inserita':
                dispatch(new InsertChiamata(action.schedaTelefonata.nuovaRichiesta, action.schedaTelefonata.azioneChiamata));
                break;
            default:
                return;
        }
    }

    @Action(InsertChiamata)
    insertChiamata({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: InsertChiamata) {

        patchState({
            azioneChiamata: action.azioneChiamata
        });

        this.chiamataService.insertChiamata(action.nuovaRichiesta).subscribe((data: SintesiRichiesta) => {
            if (data && action.azioneChiamata === AzioneChiamataEnum.InviaPartenza) {
                console.log(`Invia partenza idRichiesta: ${data}`);
                if (!environment.fakeProvider) {
                    dispatch([
                        new CestinaChiamata(),
                        new StartInviaPartenzaFromChiamata(data)
                    ]);
                } else {
                    dispatch(new SetIdChiamataInviaPartenza(data.id));
                }
            } else {
                dispatch(new CestinaChiamata());
            }
        }, () => {
            dispatch(new ShowToastr(ToastrType.Error, 'Inserimento della chiamata fallito', 'Si è verificato un errore, riprova.', 5));
            patchState({
                nuovaRichiesta: null,
                azioneChiamata: null
            });
        });

    }

    @Action(InsertChiamataSuccess)
    insertChiamataSuccess({ dispatch }: StateContext<SchedaTelefonataStateModel>, action: InsertChiamataSuccess) {
        console.log('InsertChiamataSuccess', action.nuovaRichiesta.id);
        dispatch(new AddRichiesta(action.nuovaRichiesta));
        dispatch(new ShowToastr(ToastrType.Success, 'Inserimento della chiamata effettuato', action.nuovaRichiesta.descrizione, 5));
    }

    @Action(ResetChiamata)
    resetChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>) {
        patchState(SchedaTelefonataStateDefaults);
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ dispatch }: StateContext<SchedaTelefonataStateModel>) {
        dispatch(new ClearMarkerChiamata());
        dispatch(new ResetChiamata());
        dispatch(new ToggleChiamata());
        dispatch(new ClearChiamata());
        dispatch(new GetInitCentroMappa());
    }

    @Action(MarkerChiamata)
    markerChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: MarkerChiamata) {
        const state = getState();

        if (state.idChiamataMarker) {
            dispatch(new UpdateChiamataMarker(action.marker));
        } else {
            dispatch(new SetChiamataMarker(action.marker));
        }

        const coordinate: Coordinate = {
            latitudine: action.marker.localita.coordinate.latitudine,
            longitudine: action.marker.localita.coordinate.longitudine
        };
        dispatch(new GetMarkerDatiMeteo('chiamata-' + action.marker.id, coordinate));
        dispatch(new SetCoordCentroMappa(coordinate));
        dispatch(new SetZoomCentroMappa(18));
        patchState({
            coordinate: coordinate,
            idChiamataMarker: action.marker.id
        });
    }

    @Action(ClearMarkerChiamata)
    clearMarkerChiamata({ getState, dispatch }: StateContext<SchedaTelefonataStateModel>) {
        const state = getState();
        if (state.idChiamataMarker) {
            dispatch(new DelChiamataMarker(state.idChiamataMarker));
        }
    }

    @Action(ClearChiamata)
    clearChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>) {
        patchState(SchedaTelefonataStateDefaults);
    }

    @Action(StartChiamata)
    startChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>) {
        patchState({
            resetChiamata: false
        });
    }

}
