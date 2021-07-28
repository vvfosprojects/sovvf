import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import {
    AnnullaChiamata,
    CestinaChiamata,
    ClearChiamata,
    ClearIndirizzo,
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
} from '../../actions/form-richiesta/scheda-telefonata.actions';
import { CopyToClipboard } from '../../actions/form-richiesta/clipboard.actions';
import { ToggleChiamata, ToggleModifica, ToggleRichieste } from '../../actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';
import {
    DelChiamataMarker,
    SetChiamataMarker,
    UpdateChiamataMarker
} from '../../actions/maps/chiamate-markers.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../../../shared/enum/azione-chiamata.enum';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ChiamataService } from '../../../../../core/service/chiamata-service/chiamata.service';
import {
    GetListaRichieste,
    SetIdChiamataInviaPartenza,
    SetNeedRefresh
} from '../../actions/richieste/richieste.actions';
import { RichiestaSelezionataState } from '../richieste/richiesta-selezionata.state';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { RichiestaGestioneState } from '../richieste/richiesta-gestione.state';
import { Injectable, NgZone } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthState } from '../../../../auth/store/auth.state';
import { Sede } from '../../../../../shared/model/sede.model';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PatchRichiesta, SetRichiestaModifica } from '../../actions/form-richiesta/richiesta-modifica.actions';
import { SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { ConfirmModalComponent } from '../../../../../shared/modal/confirm-modal/confirm-modal.component';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { TriageSummaryState } from '../../../../../shared/store/states/triage-summary/triage-summary.state';
import { Richiedente } from '../../../../../shared/model/richiedente.model';
import { TipologieState } from '../../../../../shared/store/states/tipologie/tipologie.state';
import { SetTriageSummary } from '../../../../../shared/store/actions/triage-summary/triage-summary.actions';
import { RichiestaForm } from '../../../../../shared/interface/forms/richiesta-form.interface';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { CountInterventiProssimitaResponse } from '../../../../../shared/interface/response/count-interventi-prossimita-response.interface';
import { InterventiProssimitaResponse } from '../../../../../shared/interface/response/interventi-prossimita-response.interface';
import { ViewComponentState } from '../view/view.state';

export interface SchedaTelefonataStateModel {
    richiestaForm: {
        model: RichiestaForm,
        dirty: boolean,
        status: string,
        errors: any
    };
    coordinate: Coordinate;
    competenze: Sede[];
    countInterventiProssimita: number;
    interventiProssimita: SintesiRichiesta[];
    countInterventiStessaVia: number;
    interventiStessaVia: SintesiRichiesta[];
    countInterventiChiusiStessoIndirizzo: number;
    interventiChiusiStessoIndirizzo: SintesiRichiesta[];
    nuovaRichiesta: SintesiRichiesta;
    azioneChiamata: AzioneChiamataEnum;
    idChiamataMarker: string;
    resetChiamata: boolean;
    loadingNuovaChiamata: boolean;
}

export const SchedaTelefonataStateDefaults: SchedaTelefonataStateModel = {
    richiestaForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    coordinate: null,
    competenze: null,
    countInterventiProssimita: undefined,
    interventiProssimita: null,
    countInterventiStessaVia: undefined,
    interventiStessaVia: null,
    countInterventiChiusiStessoIndirizzo: undefined,
    interventiChiusiStessoIndirizzo: null,
    nuovaRichiesta: null,
    azioneChiamata: null,
    idChiamataMarker: null,
    resetChiamata: true,
    loadingNuovaChiamata: false
};

@Injectable()
@State<SchedaTelefonataStateModel>({
    name: 'schedaTelefonata',
    defaults: SchedaTelefonataStateDefaults
})

export class SchedaTelefonataState {

    constructor(private chiamataService: ChiamataService,
                private store: Store,
                private ngZone: NgZone,
                private modalService: NgbModal) {
    }

    @Selector()
    static formValue(state: SchedaTelefonataStateModel): RichiestaForm {
        return state.richiestaForm.model;
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
    static countInterventiStessaVia(state: SchedaTelefonataStateModel): number {
        return state.countInterventiStessaVia;
    }

    @Selector()
    static interventiStessaVia(state: SchedaTelefonataStateModel): SintesiRichiesta[] {
        return state.interventiStessaVia;
    }

    @Selector()
    static countInterventiChiusiStessoIndirizzo(state: SchedaTelefonataStateModel): number {
        return state.countInterventiChiusiStessoIndirizzo;
    }

    @Selector()
    static interventiChiusiStessoIndirizzo(state: SchedaTelefonataStateModel): SintesiRichiesta[] {
        return state.interventiChiusiStessoIndirizzo;
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
    reducer({ dispatch }: StateContext<SchedaTelefonataStateModel>, action: ReducerSchedaTelefonata): void {

        const coordinate = action.schedaTelefonata?.markerChiamata?.localita?.coordinate;

        function getCooordinate(): Coordinate {
            return coordinate;
        }

        switch (action.schedaTelefonata.tipo) {
            case 'copiaCoordinate':
                dispatch(new CopyToClipboard(getCooordinate()));
                break;
            case 'annullata':
                dispatch(new AnnullaChiamata());
                break;
            case 'reset':
                dispatch(new ResetChiamata());
                break;
            case 'cerca':
                const markerChiamata = action.schedaTelefonata.markerChiamata;
                const indirizzo = action.schedaTelefonata.markerChiamata.localita.indirizzo;
                dispatch([
                    new MarkerChiamata(markerChiamata),
                    new SetCompetenze(getCooordinate()),
                    new SetCountInterventiProssimita(indirizzo, getCooordinate()),
                    new SetInterventiProssimita(indirizzo, getCooordinate())
                ]);
                break;
            case 'inserita':
                const urgente = action.options?.urgente;
                const fromMappa = action.options?.fromMappa;
                dispatch(new InsertChiamata(action.schedaTelefonata.azioneChiamata, { urgente, fromMappa }));
                break;
            case 'modificata':
                dispatch(new PatchRichiesta());
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
        this.chiamataService.getCountInterventiProssimita(action.indirizzo, action.coordinate).subscribe((res: CountInterventiProssimitaResponse) => {
            patchState({
                countInterventiProssimita: res.count,
                countInterventiStessaVia: res.countStessaVia,
                countInterventiChiusiStessoIndirizzo: res.countInterventiChiusiStessoIndirizzo
            });
        });
    }

    @Action(SetInterventiProssimita)
    setInterventiProssimita({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetInterventiProssimita): void {
        this.chiamataService.getInterventiProssimita(action.indirizzo, action.coordinate).subscribe((res: InterventiProssimitaResponse) => {
            patchState({
                interventiProssimita: res.dataArray,
                interventiStessaVia: res.dataArrayStessaVia,
                interventiChiusiStessoIndirizzo: res.dataArrayInterventiChiusiStessoIndirizzo
            });
        });
    }

    @Action(InsertChiamata)
    insertChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: InsertChiamata): void {
        dispatch(new StartLoadingNuovaChiamata());
        const state = getState();
        const f = state.richiestaForm.model;
        const azioneChiamata = action.azioneChiamata;
        const urgente = action.options?.urgente;
        const fromMappa = action.options?.fromMappa;

        let chiamata: SintesiRichiesta;
        let tipologia: Tipologia;
        if (f) {
            if (f.codTipologia) {
                tipologia = this.store.selectSnapshot(TipologieState.tipologie).filter((t: Tipologia) => t.codice === f.codTipologia)[0];
            }
            const triageSummary = this.store.selectSnapshot(TriageSummaryState.summary);
            chiamata = new SintesiRichiesta(
                f.id,
                f.codice,
                f.codiceRichiesta,
                f.operatore,
                f.istanteRicezioneRichiesta,
                f.stato,
                f.prioritaRichiesta,
                [tipologia],
                f.dettaglioTipologia ? f.dettaglioTipologia : null,
                f.dettaglioTipologia ? f.dettaglioTipologia.descrizione : (f.codTipologia ? tipologia.descrizione : null),
                new Richiedente(f.telefono, f.nominativo),
                {
                    indirizzo: f.indirizzo,
                    piano: f.piano,
                    palazzo: f.palazzo,
                    scala: f.scala,
                    interno: f.interno,
                    contatto: f.codSchedaContatto,
                    note: f.noteIndirizzo,
                    coordinate: {
                        longitudine: f.longitudine,
                        latitudine: f.latitudine
                    },
                },
                f.competenze,
                f.complessita,
                f.istantePresaInCarico,
                f.istantePrimaAssegnazione,
                f.rilevanzaGrave,
                f.codSchedaContatto ? f.codSchedaContatto : null,
                f.zoneEmergenza?.length ? f.zoneEmergenza.split(' ') : null,
                f.fonogramma,
                f.partenzeRichiesta,
                (f.etichette && f.etichette.length) ? f.etichette : null,
                f.notePubbliche,
                f.notePrivate,
                azioneChiamata,
                f.trnInsChiamata,
                f.turnoIntervento,
                f.tipoTerreno,
                (f.listaEnti?.length) ? f.listaEnti : null,
                f.listaEntiPresaInCarico,
                f.obiettivoSensibile,
                f.rilevanzaStArCu,
                f.motivazione,
                f.listaUtentiInLavorazione,
                f.listaUtentiPresaInCarico,
                f.codUOCompetenza,
                f.codSOAllertate,
                f.sediAllertate,
                f.codSOCompetente,
                f.listaEnti,
                f.urgenza || urgente,
                f.esercitazione,
                triageSummary?.length ? triageSummary : null
            );
        }
        patchState({ azioneChiamata });
        this.chiamataService.insertChiamata(chiamata).subscribe((chiamataResult: SintesiRichiesta) => {
            if (chiamataResult && action.azioneChiamata === AzioneChiamataEnum.InviaPartenza) {
                dispatch([
                    new CestinaChiamata(),
                    new SetIdChiamataInviaPartenza(chiamataResult),
                    new ShowToastr(
                        ToastrType.Success,
                        'Inserimento della chiamata effettuato',
                        chiamata.descrizione,
                        5,
                        null,
                        true
                    )
                ]);
            } else if (chiamataResult && chiamata.chiamataUrgente) {
                this.store.dispatch([
                    new ToggleChiamata(),
                    new SetRichiestaModifica(chiamataResult),
                    new SetTriageSummary(chiamataResult.triageSummary),
                    new ToggleModifica(),
                    new SetMarkerRichiestaSelezionato(chiamataResult.id)
                ]);
            } else if (chiamataResult && (action.azioneChiamata === AzioneChiamataEnum.InAttesa)) {
                this.store.dispatch([
                    new CestinaChiamata(),
                    new ToggleChiamata()
                ]);
            } else {
                if (fromMappa) {
                    dispatch(new ToggleRichieste());
                }
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
            dispatch([
                new GetListaRichieste({ page: currentPage }),
                new SetNeedRefresh(false)
            ]);
        } else {
            dispatch(new SetNeedRefresh(true));
        }
        if (idUtenteLoggato === action.nuovaRichiesta.operatore.id && !action.options?.trasferimento) {
            dispatch(new StopLoadingNuovaChiamata());
            const chiamataStatus = this.store.selectSnapshot(ViewComponentState.chiamataStatus);
            if (chiamataStatus) {
                dispatch(new ToggleChiamata());
            }
        } else if (idUtenteLoggato !== action.nuovaRichiesta.operatore.id) {
            dispatch(new ShowToastr(ToastrType.Success, 'Nuova chiamata inserita', action.nuovaRichiesta.descrizione, 5, null, true));
        }
    }

    @Action(ResetChiamata)
    resetChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState(SchedaTelefonataStateDefaults);
    }

    @Action(AnnullaChiamata)
    annullaChiamata({ dispatch }: StateContext<SchedaTelefonataStateModel>): void {
        this.ngZone.run(() => {
            const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
            modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
            modalConfermaAnnulla.componentInstance.titolo = 'Annulla Chiamata';
            modalConfermaAnnulla.componentInstance.messaggio = 'Sei sicuro di voler annullare la chiamata?';
            modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti saranno eliminati.';

            modalConfermaAnnulla.result.then(
                (val) => {
                    switch (val) {
                        case 'ok':
                            dispatch([
                                new CestinaChiamata(),
                                new ToggleChiamata()
                            ]);
                            break;
                        case 'ko':
                            console.log('[AnnullaChiamata] Azione annullata');
                            break;
                    }
                    console.log('Modal chiusa con val ->', val);
                },
                (err) => console.log('[AnnullaChiamata] Modale chiusa senza bottoni. Err ->', err)
            );
        });
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ dispatch }: StateContext<SchedaTelefonataStateModel>): void {
        dispatch([
            new ClearMarkerChiamata(),
            new ResetChiamata(),
            new ClearChiamata(),
            new GetInitCentroMappa()
        ]);
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
            path: 'schedaTelefonata.richiestaForm',
            value: {
                indirizzo: '',
                latitudine: '',
                longitudine: ''
            }
        }));
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
