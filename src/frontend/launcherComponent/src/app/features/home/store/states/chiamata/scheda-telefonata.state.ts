import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import {
    ApriModaleRichiestaDuplicata,
    CestinaChiamata,
    ClearChiamata, ClearIndirizzo,
    ClearMarkerChiamata,
    InsertChiamata,
    InsertChiamataSuccess,
    MarkerChiamata,
    ReducerSchedaTelefonata,
    ResetChiamata,
    SetCompetenze,
    SetCountInterventiProssimita,
    SetInterventiProssimita,
    StartChiamata,
    StartLoadingNuovaChiamata,
    StopLoadingNuovaChiamata
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
import { UpdateFormValue } from '@ngxs/form-plugin';
import { Injectable, NgZone } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RichiestaDuplicataModalComponent } from '../../../../../shared/modal/richiesta-duplicata-modal/richiesta-duplicata-modal.component';
import { AuthState } from '../../../../auth/store/auth.state';
import { Sede } from '../../../../../shared/model/sede.model';
import { ResponseInterface } from '../../../../../shared/interface/response.interface';
import { SetRichiestaModifica, SuccessRichiestaModifica } from '../../actions/richieste/richiesta-modifica.actions';
import { SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';

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
    competenze: Sede[];
    countInterventiProssimita: number;
    interventiProssimita: SintesiRichiesta[];
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
    competenze: null,
    countInterventiProssimita: undefined,
    interventiProssimita: null,
    nuovaRichiesta: null,
    azioneChiamata: null,
    idChiamataMarker: null,
    resetChiamata: true,
    loadingNuovaChiamata: false
};

@Injectable()
@State<SchedaTelefonataStateModel>({
    name: 'schedaTelefonata',
    defaults: SchedaTelefonataStateDefaults,
    children: [ClipboardState]
})

export class SchedaTelefonataState {

    constructor(private chiamataService: ChiamataService,
                private store: Store,
                private ngZone: NgZone,
                private modalService: NgbModal) {
    }

    @Selector()
    static competenze(state: SchedaTelefonataStateModel): Sede[] {
        return state.competenze;
    }

    @Selector()
    static countInterventiProssimita(state: SchedaTelefonataStateModel): number {
        return state.countInterventiProssimita;
    }

    @Selector()
    static interventiProssimita(state: SchedaTelefonataStateModel): SintesiRichiesta[] {
        return state.interventiProssimita;
    }

    @Selector()
    static resetChiamata(state: SchedaTelefonataStateModel): boolean {
        return state.resetChiamata;
    }

    @Selector()
    static myChiamataMarker(state: SchedaTelefonataStateModel): string {
        return state.idChiamataMarker;
    }

    @Selector()
    static loadingNuovaChiamata(state: SchedaTelefonataStateModel): boolean {
        return state.loadingNuovaChiamata;
    }

    @Action(ReducerSchedaTelefonata)
    reducer({ getState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: ReducerSchedaTelefonata): void {
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
                dispatch(new SetCompetenze(action.schedaTelefonata.nuovaRichiesta.localita.coordinate));
                dispatch(new SetCountInterventiProssimita(action.schedaTelefonata.nuovaRichiesta.localita.coordinate));
                dispatch(new SetInterventiProssimita(action.schedaTelefonata.nuovaRichiesta.localita.coordinate));
                break;
            case 'inserita':
                dispatch(new InsertChiamata(action.schedaTelefonata.nuovaRichiesta, action.schedaTelefonata.azioneChiamata));
                break;
            case 'modificata':
                dispatch(new SuccessRichiestaModifica());
                break;
            default:
                return;
        }
    }

    @Action(MarkerChiamata)
    markerChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: MarkerChiamata): void {
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
            coordinate,
            idChiamataMarker: action.marker.id
        });
    }

    @Action(ClearMarkerChiamata)
    clearMarkerChiamata({ getState, dispatch }: StateContext<SchedaTelefonataStateModel>): void {
        const state = getState();
        if (state.idChiamataMarker) {
            dispatch(new DelChiamataMarker(state.idChiamataMarker));
        }
    }

    @Action(SetCompetenze)
    setCompetenze({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetCompetenze): void {
        this.chiamataService.getCompetenze(action.coordinate).subscribe((res: ResponseInterface) => {
            patchState({
                competenze: res.dataArray
            });
        });
    }

    @Action(SetCountInterventiProssimita)
    setCountInterventiProssimita({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetCountInterventiProssimita): void {
        this.chiamataService.getCountInterventiProssimita(action.coordinate).subscribe((res: ResponseInterface) => {
            patchState({
                countInterventiProssimita: res.count
            });
        });
    }

    @Action(SetInterventiProssimita)
    setInterventiProssimita({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetInterventiProssimita): void {
        this.chiamataService.getInterventiProssimita(action.coordinate).subscribe((res: ResponseInterface) => {
            patchState({
                interventiProssimita: res.dataArray
            });
        });
    }

    @Action(InsertChiamata)
    insertChiamata({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: InsertChiamata): void {
        patchState({
            azioneChiamata: action.azioneChiamata
        });
        console.log('InsertChiamata', action.azioneChiamata);
        dispatch(new StartLoadingNuovaChiamata());
        action.nuovaRichiesta.richiedente.telefono = action.nuovaRichiesta.richiedente.telefono.toString();
        this.chiamataService.insertChiamata(action.nuovaRichiesta).subscribe((richiesta: SintesiRichiesta) => {
            if (richiesta && action.azioneChiamata === AzioneChiamataEnum.InviaPartenza) {
                dispatch([
                    new CestinaChiamata(),
                    new SetIdChiamataInviaPartenza(richiesta),
                    new ShowToastr(
                        ToastrType.Success,
                        'Inserimento della chiamata effettuato',
                        action.nuovaRichiesta.descrizione,
                        5,
                        null,
                        true
                    )
                ]);
            } else if (richiesta && action.nuovaRichiesta.emergenza) {
                this.store.dispatch(new SetRichiestaModifica(richiesta));
                this.store.dispatch(new SetMarkerRichiestaSelezionato(richiesta.id));
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
    insertChiamataSuccess({ dispatch }: StateContext<SchedaTelefonataStateModel>, action: InsertChiamataSuccess): void {
        console.log('InsertChiamataSuccess', action.nuovaRichiesta);
        const idRichiestaSelezionata = this.store.selectSnapshot(RichiestaSelezionataState.idRichiestaSelezionata);
        const idRichiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.idRichiestaGestione);
        const idUtenteLoggato = this.store.selectSnapshot(AuthState.currentUser).id;
        if (!idRichiestaSelezionata && !idRichiestaGestione) {
            const currentPage = this.store.selectSnapshot(PaginationState.page);
            dispatch(new GetListaRichieste({ page: currentPage }));
            dispatch(new SetNeedRefresh(false));
        } else {
            dispatch(new SetNeedRefresh(true));
        }
        dispatch(new StopLoadingNuovaChiamata());
        if (idUtenteLoggato !== action.nuovaRichiesta.operatore.id) {
            dispatch(new ShowToastr(ToastrType.Success, 'Nuova chiamata inserita', action.nuovaRichiesta.descrizione, 5, null, true));
        }
    }

    @Action(ResetChiamata)
    resetChiamata({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>): void {
        patchState(SchedaTelefonataStateDefaults);
        dispatch(
            new UpdateFormValue({
                path: 'schedaTelefonata.nuovaRichiestaForm',
                value: {
                    prioritaRichiesta: 3
                }
            })
        );
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ dispatch }: StateContext<SchedaTelefonataStateModel>): void {
        dispatch(new ClearMarkerChiamata());
        dispatch(new ResetChiamata());
        dispatch(new ToggleChiamata());
        dispatch(new ClearChiamata());
        dispatch(new GetInitCentroMappa());
    }

    @Action(ClearChiamata)
    clearChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState(SchedaTelefonataStateDefaults);
    }

    @Action(StartChiamata)
    startChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            resetChiamata: false
        });
    }

    @Action(ClearIndirizzo)
    ClearIndirizzo({ dispatch }: StateContext<SchedaTelefonataStateModel>): void {
        dispatch(new UpdateFormValue({
            path: 'schedaTelefonata.nuovaRichiestaForm',
            value: {
                indirizzo: '',
                latitudine: '',
                longitudine: ''
            }
        }));
    }

    @Action(ApriModaleRichiestaDuplicata)
    apriModaleRichiestaDuplicata({ dispatch }: StateContext<SchedaTelefonataStateModel>, action: ApriModaleRichiestaDuplicata): void {
        const innerWidth = window.innerWidth;
        if (innerWidth && innerWidth > 3700) {
            this.ngZone.run(() => {
                const richiestaDuplicataModal = this.modalService.open(RichiestaDuplicataModalComponent, {
                    windowClass: 'modal-holder modal-left',
                    size: 'lg',
                    centered: true,
                    backdrop: 'static'
                });
                richiestaDuplicataModal.componentInstance.messaggio = action.messaggio;
            });
        } else {
            this.ngZone.run(() => {
                const richiestaDuplicataModal = this.modalService.open(RichiestaDuplicataModalComponent, {
                    windowClass: 'modal-holder',
                    size: 'lg',
                    centered: true,
                    backdrop: 'static'
                });
                richiestaDuplicataModal.componentInstance.messaggio = action.messaggio;
            });
        }
    }

    @Action(StartLoadingNuovaChiamata)
    startLoadingNuovaChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            loadingNuovaChiamata: true
        });
    }

    @Action(StopLoadingNuovaChiamata)
    stopLoadingNuovaChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            loadingNuovaChiamata: false
        });
    }

}
