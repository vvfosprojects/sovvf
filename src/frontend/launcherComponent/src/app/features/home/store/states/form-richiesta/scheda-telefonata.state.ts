import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import {
    AnnullaChiamata,
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
} from '../../actions/form-richiesta/scheda-telefonata.actions';
import { CopyToClipboard } from '../../actions/form-richiesta/clipboard.actions';
import { ToggleChiamata, ToggleModifica } from '../../actions/view/view.actions';
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
import { PatchRichiesta, SetRichiestaModifica } from '../../actions/form-richiesta/richiesta-modifica.actions';
import { SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { ConfirmModalComponent } from '../../../../../shared/modal/confirm-modal/confirm-modal.component';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { TriageSummaryState } from '../../../../../shared/store/states/triage-summary/triage-summary.state';
import { Richiedente } from '../../../../../shared/model/richiedente.model';
import { TipologieState } from '../../../../../shared/store/states/tipologie/tipologie.state';
import { Ente } from '../../../../../shared/interface/ente.interface';
import { Utente } from '../../../../../shared/model/utente.model';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';
import { DettaglioTipologia } from '../../../../../shared/interface/dettaglio-tipologia.interface';
import { Complessita } from '../../../../../shared/model/complessita.model';
import { Fonogramma } from '../../../../../shared/model/fonogramma.model';
import { Partenza } from '../../../../../shared/model/partenza.model';
import { TurnoIntervento } from '../../../../../shared/model/turno-intervento';
import { AttivitaUtente } from '../../../../../shared/model/attivita-utente.model';
import { ObiettivoSensibile } from '../../../../../shared/model/obiettivo-sensibile';
import { TipoTerreno } from '../../../../../shared/model/tipo-terreno';
import { SetTriageSummary } from '../../../../../shared/store/actions/triage-summary/triage-summary.actions';

export interface SchedaTelefonataStateModel {
    richiestaForm: {
        model: {
            id: string,
            codice: string,
            codiceRichiesta: string,
            operatore: Utente,
            istanteRicezioneRichiesta: Date,
            stato: StatoRichiesta,
            codTipologia: string,
            dettaglioTipologia: DettaglioTipologia,
            nominativo: string,
            telefono: string,
            competenze: Sede[],
            complessita: Complessita,
            istantePresaInCarico: Date,
            istantePrimaAssegnazione: Date,
            trnInsChiamata: string,
            turnoIntervento: TurnoIntervento,
            tipoTerreno: TipoTerreno[],
            indirizzo: string,
            latitudine: number,
            longitudine: number,
            piano: string,
            palazzo: string,
            scala: string,
            interno: string,
            etichette: string[],
            noteIndirizzo: string,
            obiettivoSensibile: ObiettivoSensibile,
            rilevanzaGrave: boolean,
            rilevanzaStArCu: boolean,
            notePrivate: string,
            notePubbliche: string,
            descrizione: string,
            zoneEmergenza: string,
            prioritaRichiesta: number,
            codSchedaContatto: string,
            listaEntiPresaInCarico: Ente[],
            urgenza: boolean,
            codSOCompetente: string,
            sediAllertate: Sede[],
            codSOAllertate: string[],
            fonogramma: Fonogramma,
            partenzeRichiesta: Partenza[],
            listaEnti: Ente[],
            motivazione: string,
            listaUtentiInLavorazione: AttivitaUtente[],
            listaUtentiPresaInCarico: AttivitaUtente[],
            codUOCompetenza: string[]
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
    static formValue(state: SchedaTelefonataStateModel): any {
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
        const coordinate = getState().coordinate;
        switch (action.schedaTelefonata.tipo) {
            case 'copiaIndirizzo':
                dispatch(new CopyToClipboard(coordinate));
                break;
            case 'annullata':
                dispatch(new AnnullaChiamata());
                break;
            case 'reset':
                dispatch(new ResetChiamata());
                break;
            case 'cerca':
                dispatch([
                    new MarkerChiamata(action.schedaTelefonata.markerChiamata),
                    new SetCompetenze(action.schedaTelefonata.markerChiamata.localita.coordinate),
                    new SetCountInterventiProssimita(action.schedaTelefonata.markerChiamata.localita.coordinate),
                    new SetInterventiProssimita(action.schedaTelefonata.markerChiamata.localita.coordinate)
                ]);
                break;
            case 'inserita':
                const urgente = action.options?.urgente;
                dispatch(new InsertChiamata(action.schedaTelefonata.azioneChiamata, { urgente }));
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
    insertChiamata({ getState, patchState, dispatch }: StateContext<SchedaTelefonataStateModel>, action: InsertChiamata): void {
        dispatch(new StartLoadingNuovaChiamata());
        const state = getState();
        const f = state.richiestaForm.model;
        const azioneChiamata = action.azioneChiamata;
        const urgente = action.options?.urgente;
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
                triageSummary?.length ? triageSummary : null
            );
        }
        patchState({ azioneChiamata });
        console.log('chiamata', chiamata);
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
            } else if (chiamataResult && (chiamata.chiamataUrgente || action.azioneChiamata === AzioneChiamataEnum.InAttesa)) {
                this.store.dispatch([
                    new ToggleChiamata(),
                    new SetRichiestaModifica(chiamataResult),
                    new SetTriageSummary(chiamataResult.triageSummary),
                    new ToggleModifica(),
                    new SetMarkerRichiestaSelezionato(chiamataResult.id)
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
        if (idUtenteLoggato === action.nuovaRichiesta.operatore.id) {
            dispatch([
                new StopLoadingNuovaChiamata(),
                new ToggleChiamata()
            ]);
        } else {
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
            modalConfermaAnnulla.componentInstance.bottoni = [
                { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
                { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
            ];

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
