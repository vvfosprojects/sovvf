import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import {
    AnnullaChiamata,
    CestinaChiamata,
    ClearChiamata,
    ClearCompetenze,
    ClearCountInterventiProssimita,
    ClearIndirizzo,
    ClearInterventiProssimita,
    ClearMarkerChiamata,
    InsertChiamata,
    InsertChiamataSuccess,
    MarkerChiamata,
    ReducerSchedaTelefonata,
    ResetChiamata,
    SetCompetenze,
    SetCompetenzeSuccess,
    SetCountInterventiProssimita,
    SetInterventiProssimita,
    SetRedirectComposizionePartenza,
    StartChiamata,
    StartLoadingCompetenze,
    StartLoadingDettagliTipologia,
    StartLoadingSchedaRichiesta,
    StopLoadingCompetenze,
    StopLoadingDettagliTipologia,
    StopLoadingSchedaRichiesta
} from '../../actions/form-richiesta/scheda-telefonata.actions';
import { CopyToClipboard } from '../../actions/form-richiesta/clipboard.actions';
import { ToggleChiamata, ToggleComposizione, ToggleModifica } from '../../actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../../../maps/store/actions/centro-mappa.actions';
import { DelChiamataMarker, SetChiamataMarker, UpdateChiamataMarker } from '../../../../maps/store/actions/chiamate-markers.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../../../shared/enum/azione-chiamata.enum';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ChiamataService } from '../../../../../core/service/chiamata-service/chiamata.service';
import { GetListaRichieste, SetIdChiamataInviaPartenza, SetNeedRefresh } from '../../actions/richieste/richieste.actions';
import { RichiestaSelezionataState } from '../richieste/richiesta-selezionata.state';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { RichiestaGestioneState } from '../richieste/richiesta-gestione.state';
import { Injectable, NgZone } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthState } from '../../../../auth/store/auth.state';
import { Sede } from '../../../../../shared/model/sede.model';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PatchRichiesta, SetRichiestaModifica } from '../../actions/form-richiesta/richiesta-modifica.actions';
import { ConfirmModalComponent } from '../../../../../shared/modal/confirm-modal/confirm-modal.component';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { TriageSummaryState } from '../../../../../shared/store/states/triage-summary/triage-summary.state';
import { Richiedente } from '../../../../../shared/model/richiedente.model';
import { TipologieState } from '../../../../../shared/store/states/tipologie/tipologie.state';
import { RichiestaForm } from '../../../../../shared/interface/forms/richiesta-form.interface';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { CountInterventiProssimitaResponse } from '../../../../../shared/interface/response/count-interventi-prossimita-response.interface';
import { InterventiProssimitaResponse } from '../../../../../shared/interface/response/interventi-prossimita-response.interface';
import { ViewComponentState } from '../view/view.state';
import { TipoTerreno } from 'src/app/shared/model/tipo-terreno';
import { TipoTerrenoEnum } from 'src/app/shared/enum/tipo-terreno.enum';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SetRichiestaComposizione } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { getGeneriMezzoTriageSummary } from '../../../../../shared/helper/function-triage';
import { SetFiltriGeneriMezzoTriage } from '../../../../../shared/store/actions/filtri-composizione/filtri-composizione.actions';

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
    loadingSchedaRichiesta: boolean;
    loadingCompetenze: boolean;
    loadingDettagliTipologia: boolean;
    redirectComposizionePartenza: boolean;
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
    loadingSchedaRichiesta: false,
    loadingCompetenze: false,
    loadingDettagliTipologia: false,
    redirectComposizionePartenza: false,
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
    static loadingSchedaRichiesta(state: SchedaTelefonataStateModel): boolean {
        return state.loadingSchedaRichiesta;
    }

    @Selector()
    static loadingCompetenze(state: SchedaTelefonataStateModel): boolean {
        return state.loadingCompetenze;
    }

    @Selector()
    static loadingDettagliTipologia(state: SchedaTelefonataStateModel): boolean {
        return state.loadingDettagliTipologia;
    }

    @Selector()
    static redirectComposizionePartenza(state: SchedaTelefonataStateModel): boolean {
        return state.redirectComposizionePartenza;
    }

    @Action(ReducerSchedaTelefonata)
    reducer({ getState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: ReducerSchedaTelefonata): void {
        const state = getState();
        const coordinate = action.schedaTelefonata?.markerChiamata?.localita?.coordinate ? action.schedaTelefonata.markerChiamata.localita.coordinate : {
            latitudine: state.richiestaForm?.model?.latitudine,
            longitudine: state.richiestaForm?.model?.longitudine
        };

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
                dispatch(new SetCompetenze(getCooordinate(), indirizzo, markerChiamata));
                break;
            case 'inserita':
                const urgente = action.options?.urgente;
                const fromMappa = action.options?.fromMappa;
                dispatch(new InsertChiamata(action.schedaTelefonata.azioneChiamata, action.schedaTelefonata.formValue, { urgente, fromMappa }));
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
            dispatch(new UpdateChiamataMarker(action.marker, action.codCompetenze));
        } else {
            dispatch(new SetChiamataMarker(action.marker, action.codCompetenze));
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
        dispatch(new StartLoadingCompetenze());
        this.chiamataService.getCompetenze(action.coordinate).subscribe((res: ResponseInterface) => {
            if (res?.dataArray) {
                const competenze = res.dataArray as Sede[];
                const codCompetenze = competenze.map((c: Sede) => {
                    return c.codice;
                });

                dispatch(new SetCompetenzeSuccess(action.coordinate, action.indirizzo, codCompetenze, action.markerChiamata));

                patchState({
                    competenze
                });
            } else {
                dispatch([
                    new ClearCompetenze(),
                    new StopLoadingCompetenze()
                ]);
                patchState({
                    competenze: []
                });
            }
        }, () => {
            dispatch(new StopLoadingCompetenze());
            patchState({
                competenze: []
            });
        });
    }

    @Action(SetCompetenzeSuccess)
    setCompetenzeSuccess({ patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: SetCompetenzeSuccess): void {
        dispatch([
            new SetCountInterventiProssimita(action.indirizzo, action.coordinate, action.codCompetenze),
            new SetInterventiProssimita(action.indirizzo, action.coordinate, action.codCompetenze),
            new StopLoadingCompetenze()
        ]);

        if (action.markerChiamata) {
            dispatch(new MarkerChiamata(action.markerChiamata, action.codCompetenze));
        }
    }

    @Action(ClearCompetenze)
    clearCompetenze({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            competenze: SchedaTelefonataStateDefaults.competenze
        });
    }

    @Action(SetCountInterventiProssimita)
    setCountInterventiProssimita({ patchState }: StateContext<SchedaTelefonataStateModel>, action: SetCountInterventiProssimita): void {
        this.chiamataService.getCountInterventiProssimita(action.indirizzo, action.coordinate, action.codCompetenze).subscribe((res: CountInterventiProssimitaResponse) => {
            if (res) {
                patchState({
                    countInterventiProssimita: res.count,
                    countInterventiStessaVia: res.countStessaVia,
                    countInterventiChiusiStessoIndirizzo: res.countInterventiChiusiStessoIndirizzo
                });
            }
        });
    }

    @Action(ClearCountInterventiProssimita)
    clearCountInterventiProssimita({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            countInterventiProssimita: 0,
            countInterventiStessaVia: 0,
            countInterventiChiusiStessoIndirizzo: 0
        });
    }

    @Action(SetInterventiProssimita)
    setInterventiProssimita({ patchState }: StateContext<SchedaTelefonataStateModel>, action: SetInterventiProssimita): void {
        this.chiamataService.getInterventiProssimita(action.indirizzo, action.coordinate, action.codCompetenze).subscribe((res: InterventiProssimitaResponse) => {
            if (res) {
                patchState({
                    interventiProssimita: res.dataArray,
                    interventiStessaVia: res.dataArrayStessaVia,
                    interventiChiusiStessoIndirizzo: res.dataArrayInterventiChiusiStessoIndirizzo
                });
            }
        });
    }

    @Action(ClearInterventiProssimita)
    clearInterventiProssimita({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            interventiProssimita: null,
            interventiStessaVia: null,
            interventiChiusiStessoIndirizzo: null
        });
    }

    @Action(InsertChiamata)
    insertChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: InsertChiamata): void {
        dispatch(new StartLoadingSchedaRichiesta());
        const state = getState();
        const f = state.richiestaForm.model;
        const componentFormValue = action.componentFormValue;
        const azioneChiamata = action.azioneChiamata;
        const urgente = action.options?.urgente;

        let chiamata: SintesiRichiesta;
        let tipologia: Tipologia;

        if (f) {
            const codTipologia = f.codTipologia ? f.codTipologia : componentFormValue.codTipologia;
            if (codTipologia) {
                const tipologie = this.store.selectSnapshot(TipologieState.tipologie);
                tipologia = tipologie.filter((t: Tipologia) => t.codice === codTipologia)[0];
            }

            const competenze = state.competenze;
            let codCompetenze: string[];
            if (competenze?.length <= 0) {
                if (f.codPrimaCompetenza || f.codSecondaCompetenza || f.codTerzaCompetenza) {
                    codCompetenze = [f.codPrimaCompetenza, f.codSecondaCompetenza, f.codTerzaCompetenza];
                } else {
                    codCompetenze = [f.codCompetenzaCentrale];
                }
            }

            const triageSummary = this.store.selectSnapshot(TriageSummaryState.summary);
            const tipiTerreno = [] as TipoTerreno[];

            if (f.boschi) {
                tipiTerreno.push({
                    descrizione: TipoTerrenoEnum.Boschi,
                    ha: f.boschi
                });
            }
            if (f.campi) {
                tipiTerreno.push({
                    descrizione: TipoTerrenoEnum.Campi,
                    ha: f.campi
                });
            }
            if (f.sterpaglie) {
                tipiTerreno.push({
                    descrizione: TipoTerrenoEnum.Sterpaglie,
                    ha: f.sterpaglie
                });
            }

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
                    provincia: f.provincia,
                    cap: f.cap,
                    regione: f.regione,
                    civico: f.civico
                },
                competenze,
                codCompetenze,
                f.complessita,
                f.istantePresaInCarico,
                f.istantePrimaAssegnazione,
                f.rilevanzaGrave,
                f.codSchedaContatto ? f.codSchedaContatto : null,
                null,
                f.fonogramma,
                f.partenze,
                (f.etichette && f.etichette.length) ? f.etichette : null,
                f.notePubbliche,
                f.notePrivate,
                azioneChiamata,
                f.trnInsChiamata,
                f.turnoIntervento,
                tipiTerreno.length ? tipiTerreno : null,
                f.codEntiIntervenuti?.length ? f.codEntiIntervenuti : null,
                f.listaEntiPresaInCarico,
                f.obiettivoSensibile,
                f.rilevanzaStArCu,
                f.motivazione,
                f.listaUtentiPresaInCarico,
                f.codUOCompetenza,
                f.codSOAllertate,
                f.sediAllertate,
                f.codSOCompetente,
                f.urgenza || urgente,
                f.esercitazione,
                triageSummary?.length ? triageSummary : null,
                f.noteNue
            );
        }

        patchState({ azioneChiamata });

        this.chiamataService.insertChiamata(chiamata).subscribe((chiamataResult: SintesiRichiesta) => {
            if (chiamataResult && action.azioneChiamata === AzioneChiamataEnum.InviaPartenza) {
                dispatch([
                    new CestinaChiamata({ bypassInitCentroMappa: true }),
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
                    new CestinaChiamata(),
                    new ToggleChiamata(),
                    new SetRichiestaModifica(chiamataResult),
                    new ToggleModifica()
                ]);
            } else if (chiamataResult && (action.azioneChiamata === AzioneChiamataEnum.InAttesa)) {
                this.store.dispatch([
                    new CestinaChiamata(),
                    new ToggleChiamata()
                ]);
            } else {
                dispatch(new CestinaChiamata());
            }
        }, () => {
            dispatch(new StopLoadingSchedaRichiesta());
            dispatch(new SetRedirectComposizionePartenza(false));
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
            const chiamataStatus = this.store.selectSnapshot(ViewComponentState.chiamataStatus);
            const redirectComposizionePartenza = this.store.selectSnapshot(SchedaTelefonataState.redirectComposizionePartenza);
            if (chiamataStatus && !redirectComposizionePartenza) {
                dispatch(new ToggleChiamata(false, true));
            } else if (chiamataStatus && redirectComposizionePartenza) {
                // Se 'Conferma e Invia Partenza' allora lancio il toggle della composizione avanzata
                dispatch([
                    new SetRichiestaComposizione(action.nuovaRichiesta),
                    new ToggleComposizione(Composizione.Avanzata)
                ]);

                const generiMezzoTriage = getGeneriMezzoTriageSummary(action.nuovaRichiesta?.triageSummary);
                if (generiMezzoTriage?.length) {
                    this.store.dispatch(new SetFiltriGeneriMezzoTriage(generiMezzoTriage));
                }
            }
            dispatch(new StopLoadingSchedaRichiesta());
        } else if (idUtenteLoggato !== action.nuovaRichiesta.operatore.id) {
            dispatch(new ShowToastr(ToastrType.Success, 'Nuova chiamata inserita', action.nuovaRichiesta.descrizione, 5, null, true));
        }
    }

    @Action(ResetChiamata)
    resetChiamata({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState(SchedaTelefonataStateDefaults);
    }

    @Action(AnnullaChiamata)
    annullaChiamata({ getState, dispatch }: StateContext<SchedaTelefonataStateModel>): void {
        const state = getState();
        const formIsDirty = state.richiestaForm.dirty;
        if (formIsDirty) {
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
        } else {
            dispatch([
                new CestinaChiamata(),
                new ToggleChiamata()
            ]);
        }
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ dispatch }: StateContext<SchedaTelefonataStateModel>, action: CestinaChiamata): void {
        const bypassInitCentroMappa = action.options?.bypassInitCentroMappa;
        dispatch([
            new ClearMarkerChiamata(),
            new ResetChiamata(),
            new ClearChiamata(),
            !bypassInitCentroMappa && new GetInitCentroMappa()
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

    @Action(StartLoadingSchedaRichiesta)
    startLoadingSchedaRichiesta({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            loadingSchedaRichiesta: true
        });
    }

    @Action(StopLoadingSchedaRichiesta)
    stopLoadingSchedaRichiesta({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            loadingSchedaRichiesta: false
        });
    }

    @Action(StartLoadingCompetenze)
    startLoadingCompetenze({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            loadingCompetenze: true
        });
    }

    @Action(StopLoadingCompetenze)
    stopLoadingCompetenze({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            loadingCompetenze: false
        });
    }

    @Action(StartLoadingDettagliTipologia)
    startLoadingDettagliTipologia({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            loadingDettagliTipologia: true
        });
    }

    @Action(StopLoadingDettagliTipologia)
    stopLoadingDettagliTipologia({ patchState }: StateContext<SchedaTelefonataStateModel>): void {
        patchState({
            loadingDettagliTipologia: false
        });
    }

    @Action(SetRedirectComposizionePartenza)
    setRedirectComposizionePartenza({ patchState }: StateContext<SchedaTelefonataStateModel>, action: any): void {
        patchState({
            redirectComposizionePartenza: action.redirect
        });
    }
}
