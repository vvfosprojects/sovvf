import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import {
    CestinaChiamata,
    ClearChiamata, ClearIndirizzo,
    ClearMarkerChiamata,
    InsertChiamata,
    InsertChiamataSuccess,
    MarkerChiamata,
    ReducerSchedaTelefonata,
    ResetChiamata,
    StartChiamata, StartLoadingNuovaChiamata, StopLoadingNuovaChiamata
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
import { GetListaRichieste, SetIdChiamataInviaPartenza, SetNeedRefresh } from '../../actions/richieste/richieste.actions';
import { RichiestaSelezionataState } from '../richieste/richiesta-selezionata.state';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { RichiestaGestioneState } from '../richieste/richiesta-gestione.state';
import { Validators } from '@angular/forms';
import { UpdateFormValue } from '@ngxs/form-plugin';

export interface SchedaTelefonataStateModel {
    nuovaRichiestaForm: {
        model: {
            selectedTipologie: string[],
            nominativo: string,
            telefono: string,
            indirizzo: string,
            latitudine: string,
            longitudine: string,
            piano: string,
            etichette: string,
            noteIndirizzo: string,
            rilevanzaGrave: boolean,
            rilevanzaStArCu: boolean,
            notePrivate: string,
            notePubbliche: string,
            descrizione: string,
            zoneEmergenza: string,
            prioritaRichiesta: number
        },
        dirty: boolean,
        status: string,
        errors: any
    };
    coordinate: Coordinate;
    nuovaRichiesta: SintesiRichiesta;
    azioneChiamata: AzioneChiamataEnum;
    idChiamataMarker: string;
    resetChiamata: boolean;
    loadingNuovaChiamata: boolean;
}

export const SchedaTelefonataStateDefaults: SchedaTelefonataStateModel = {
    nuovaRichiestaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    coordinate: null,
    nuovaRichiesta: null,
    azioneChiamata: null,
    idChiamataMarker: null,
    resetChiamata: true,
    loadingNuovaChiamata: false
};

@State<SchedaTelefonataStateModel>({
    name: 'schedaTelefonata',
    defaults: SchedaTelefonataStateDefaults,
    children: [ClipboardState]
})

export class SchedaTelefonataState {

    constructor(private chiamataService: ChiamataService, private store: Store) {
    }

    @Selector()
    static resetChiamata(state: SchedaTelefonataStateModel) {
        return state.resetChiamata;
    }

    @Selector()
    static myChiamataMarker(state: SchedaTelefonataStateModel) {
        return state.idChiamataMarker;
    }

    @Selector()
    static loadingNuovaChiamata(state: SchedaTelefonataStateModel) {
        return state.loadingNuovaChiamata;
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
        dispatch(new StartLoadingNuovaChiamata());

        action.nuovaRichiesta.richiedente.telefono = action.nuovaRichiesta.richiedente.telefono.toString();
        this.chiamataService.insertChiamata(action.nuovaRichiesta).subscribe((richiesta: SintesiRichiesta) => {
            if (richiesta && action.azioneChiamata === AzioneChiamataEnum.InviaPartenza) {
                dispatch([
                    new CestinaChiamata(),
                    new SetIdChiamataInviaPartenza(richiesta)
                ]);
            } else {
                dispatch(new CestinaChiamata());
            }
        }, () => {
            dispatch(new StopLoadingNuovaChiamata());
            patchState({
                nuovaRichiesta: null,
                azioneChiamata: null
            });
        });

    }

    @Action(InsertChiamataSuccess)
    insertChiamataSuccess({ dispatch }: StateContext<SchedaTelefonataStateModel>, action: InsertChiamataSuccess) {
        const idRichiestaSelezionata = this.store.selectSnapshot(RichiestaSelezionataState.idRichiestaSelezionata);
        const idRichiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.idRichiestaGestione);
        if (!idRichiestaSelezionata && !idRichiestaGestione) {
            const currentPage = this.store.selectSnapshot(PaginationState.page);
            dispatch(new GetListaRichieste({ page: currentPage }));
            dispatch(new SetNeedRefresh(false));
        } else {
            dispatch(new SetNeedRefresh(true));
        }
        dispatch(new StopLoadingNuovaChiamata());
        dispatch(new ShowToastr(ToastrType.Success, 'Inserimento della chiamata effettuato', action.nuovaRichiesta.descrizione, 5, null, true));
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

    @Action(ClearIndirizzo)
    ClearIndirizzo({ dispatch }: StateContext<SchedaTelefonataStateModel>) {
        dispatch(new UpdateFormValue({
            path: 'schedaTelefonata.nuovaRichiestaForm',
            value: {
                indirizzo: '',
                latitudine: '',
                longitudine: ''
            }
        }));
    }

    @Action(StartLoadingNuovaChiamata)
    startLoadingNuovaChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>) {
        patchState({
            loadingNuovaChiamata: true
        });
    }

    @Action(StopLoadingNuovaChiamata)
    stopLoadingNuovaChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>) {
        patchState({
            loadingNuovaChiamata: false
        });
    }

}
