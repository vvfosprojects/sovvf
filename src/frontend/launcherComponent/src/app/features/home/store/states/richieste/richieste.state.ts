import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import {
    ActionMezzo,
    ActionRichiesta,
    AddRichiesta,
    AddRichieste,
    AllertaSede,
    ClearIdChiamataInviaPartenza,
    ClearRichiestaAzioni,
    ClearRichiestaById,
    ClearRichieste,
    GetListaRichieste,
    ModificaStatoFonogramma,
    SetIdChiamataInviaPartenza,
    SetNeedRefresh,
    SetRichiestaAzioni,
    SetRichiestaById,
    StartInviaPartenzaFromChiamata,
    StartLoadingActionMezzo,
    StartLoadingActionRichiesta,
    StartLoadingModificaFonogramma,
    StartLoadingRichieste,
    StopLoadingActionMezzo,
    StopLoadingActionRichiesta,
    StopLoadingModificaFonogramma,
    StopLoadingRichieste,
    UpdateRichiesta,
    VisualizzaListaSquadrePartenza
} from '../../actions/richieste/richieste.actions';
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { RichiestaFissataState } from './richiesta-fissata.state';
import { RichiestaHoverState } from './richiesta-hover.state';
import { RichiestaSelezionataState } from './richiesta-selezionata.state';
import { UpdateRichiestaComposizione } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../composizione-partenza/composizione-partenza.state';
import { RichiestaGestioneState } from './richiesta-gestione.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RicercaFilterbarState } from '../filterbar/ricerca-filterbar.state';
import { FiltriRichiesteState } from '../filterbar/filtri-richieste.state';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { ClearRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { ClearRichiestaHover } from '../../actions/richieste/richiesta-hover.actions';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { AuthState } from '../../../../auth/store/auth.state';
import { UpdateRichiestaFissata } from '../../actions/richieste/richiesta-fissata.actions';
import { ListaSquadrePartenzaComponent } from '../../../../../shared/components/lista-squadre-partenza/lista-squadre-partenza.component';
import { Injectable } from '@angular/core';
import { ImpostazioniState } from '../../../../../shared/store/states/impostazioni/impostazioni.state';
import { ViewComponentState } from '../view/view.state';
import { calcolaActionSuggeritaMezzo } from '../../../../../shared/helper/function-mezzo';
import { getStatoFonogrammaEnumByName } from '../../../../../shared/helper/function-fonogramma';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import { AddAnnullaStatoMezzi, RemoveAnnullaStatoMezzi } from '../../../../../shared/store/actions/loading/loading.actions';
import { SetRedirectComposizionePartenza } from '../../actions/form-richiesta/scheda-telefonata.actions';
import { FiltroZoneEmergenzaState } from '../filterbar/filtro-zone-emergenza.state';
import { HttpErrorResponse } from '@angular/common/http';
import { setPageSession } from '../../../../../shared/helper/function-paginazione-session';
import { AppFeatures } from '../../../../../shared/enum/app-features.enum';
import { LSNAME } from '../../../../../core/settings/config';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { UpdateFormValue } from '@ngxs/form-plugin';

export interface RichiesteStateModel {
    richieste: SintesiRichiesta[];
    richiestaById: SintesiRichiesta;
    richiestaAzioni: SintesiRichiesta;
    chiamataInviaPartenza: string;
    loadingRichieste: boolean;
    loadingActionMezzo: string[];
    loadingActionRichiesta: string[];
    loadingModificaFonogramma: boolean;
    needRefresh: boolean;
}

export const RichiesteStateDefaults: RichiesteStateModel = {
    richieste: [],
    richiestaById: null,
    richiestaAzioni: null,
    chiamataInviaPartenza: null,
    loadingRichieste: false,
    loadingActionMezzo: null,
    loadingActionRichiesta: null,
    loadingModificaFonogramma: false,
    needRefresh: false
};

@Injectable()
@State<RichiesteStateModel>({
    name: 'richieste',
    defaults: RichiesteStateDefaults,
    children: [
        RichiestaFissataState,
        RichiestaHoverState,
        RichiestaSelezionataState,
        RichiestaGestioneState
    ]
})
export class RichiesteState {

    @Selector()
    static richieste(state: RichiesteStateModel): SintesiRichiesta[] {
        return state.richieste;
    }

    @Selector()
    static getRichiestaById(state: RichiesteStateModel): SintesiRichiesta {
        return state.richiestaById;
    }

    @Selector()
    static richiestaById(state: RichiesteStateModel): any {
        return (id: string) => state.richieste.find(x => x.id === id);
    }

    @Selector()
    static richiestaAzioni(state: RichiesteStateModel): SintesiRichiesta {
        return state.richiestaAzioni;
    }

    @Selector()
    static needRefresh(state: RichiesteStateModel): boolean {
        return state.needRefresh;
    }

    @Selector()
    static loadingRichieste(state: RichiesteStateModel): boolean {
        return state.loadingRichieste;
    }

    @Selector()
    static loadingActionMezzo(state: RichiesteStateModel): string[] {
        return state.loadingActionMezzo;
    }

    @Selector()
    static loadingActionRichiesta(state: RichiesteStateModel): string[] {
        return state.loadingActionRichiesta;
    }

    @Selector()
    static loadingModificaFonogramma(state: RichiesteStateModel): boolean {
        return state.loadingModificaFonogramma;
    }

    constructor(private richiesteService: SintesiRichiesteService,
                private modalService: NgbModal,
                private store: Store) {
    }

    @Action(GetListaRichieste, { cancelUncompleted: true })
    getRichieste({ getState, dispatch }: StateContext<RichiesteStateModel>, action: GetListaRichieste): void {
        const state = getState();
        const utente = this.store.selectSnapshot(AuthState.currentUser);
        if (utente) {
            dispatch(new StartLoadingRichieste());
            const boxesVisibili = this.store.selectSnapshot(ImpostazioniState.boxAttivi);
            const richiestaFissata = this.store.selectSnapshot(RichiestaFissataState.richiestaFissata);
            const ricerca = this.store.selectSnapshot(RicercaFilterbarState.ricerca);
            const filtroStato = this.store.selectSnapshot(FiltriRichiesteState.selezioneStatoRichiesta);
            const zoneEmergenza = this.store.selectSnapshot(FiltroZoneEmergenzaState.filtriZoneEmergenzaSelezionate);
            const chiuse = this.store.selectSnapshot(FiltriRichiesteState.chiuse);
            const periodoChiuseChiamate = this.store.selectSnapshot(FiltriRichiesteState.periodoChiuseChiamate);
            const periodoChiusiInterventi = this.store.selectSnapshot(FiltriRichiesteState.periodoChiusiInterventi);
            const richiestePerPagina = boxesVisibili ? 7 : 8;
            const filters = {
                search: ricerca,
                others: this.store.selectSnapshot(FiltriRichiesteState.filtriRichiesteSelezionati),
                statiRichiesta: this.store.selectSnapshot(FiltriRichiesteState.filtriStatoRichiestaSelezionati),
                filtroStato,
                zoneEmergenza,
                chiuse,
                periodoChiuseChiamate,
                periodoChiusiInterventi
            };
            const pageSession = sessionStorage.getItem(LSNAME.pagesSession.pageRichieste);
            const pagination = {
                page: action.options?.page ? action.options.page : pageSession ? +pageSession : 1,
                pageSize: richiestePerPagina
            };
            this.richiesteService.getRichieste(filters, pagination).subscribe((response: ResponseInterface) => {
                setPageSession(AppFeatures.Richieste, pagination.page.toString());
                const richiesteActive = this.store.selectSnapshot(ViewComponentState.richiesteStatus);
                const listaRichieste = makeCopy(response.sintesiRichiesta);
                if (richiestaFissata && listaRichieste.length >= 7) {
                    let skipRemove;
                    listaRichieste.forEach(x => x.codice === richiestaFissata.codice ? skipRemove = true : null);
                    if (!skipRemove) {
                        listaRichieste.pop();
                    }
                }
                if (richiesteActive) {
                    dispatch([
                        new AddRichieste(listaRichieste),
                        new PatchPagination(response.pagination),
                    ]);
                }
                dispatch(new StopLoadingRichieste());
                if (state.needRefresh) {
                    dispatch(new SetNeedRefresh(false));
                }
            }, () => {
                dispatch(new StopLoadingRichieste());
            });
            // Clear dei dati presenti nella pagina che si sta lasciando
            dispatch(new ClearRichiestaHover());
            const richiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione);
            if (richiestaGestione) {
                dispatch(new ClearRichiestaGestione());
            }
        }
    }

    @Action(AddRichieste)
    setRichieste({ getState, patchState }: StateContext<RichiesteStateModel>, action: AddRichieste): void {
        patchState({
            richieste: action.richieste
        });
    }

    @Action(ClearRichieste)
    clearRichieste({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState(RichiesteStateDefaults);
    }


    @Action(SetNeedRefresh)
    setNeedRefresh({ getState, patchState }: StateContext<RichiesteStateModel>, action: SetNeedRefresh): void {
        const needRefreshValue = action.value;
        if (needRefreshValue === true) {
            patchState({
                needRefresh: needRefreshValue
            });
        } else if (needRefreshValue === false) {
            patchState({
                needRefresh: needRefreshValue
            });
        }
    }

    @Action(UpdateRichiesta)
    updateRichiesta({ getState, setState, dispatch }: StateContext<RichiesteStateModel>, action: UpdateRichiesta): void {
        if (action.richiesta) {
            // Controllo se la richiesta aggiornata è anche la richiesta attualmente in composzione
            const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
            if (richiestaComposizione && richiestaComposizione.id === action.richiesta.id) {
                dispatch(new UpdateRichiestaComposizione(action.richiesta));
            }
            setState(
                patch({
                    richieste: updateItem<SintesiRichiesta>(r => r.id === action.richiesta.id, action.richiesta)
                })
            );

            const state = getState();
            const idRichiestaFissata = this.store.selectSnapshot(RichiestaFissataState.idRichiestaFissata);

            if (idRichiestaFissata && (idRichiestaFissata === action.richiesta.id)) {
                dispatch(new UpdateRichiestaFissata(action.richiesta));
            }

            if (state.loadingActionRichiesta?.includes(action.richiesta.id)) {
                dispatch(new StopLoadingActionRichiesta(action.richiesta.id));
            }

            const mezziInServizioActive = this.store.selectSnapshot(ViewComponentState.mezziInServizioStatus);

            if (mezziInServizioActive) {
                dispatch(new SetRichiestaById(action.richiesta.codice));
            }

            const idRichiestaSelezionata = this.store.selectSnapshot(RichiestaSelezionataState.idRichiestaSelezionata);
            const idRichiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.idRichiestaGestione);
            const loaderRichieste = state.loadingRichieste;
            if (!idRichiestaSelezionata && !idRichiestaGestione && !loaderRichieste) {
                const currentPage = this.store.selectSnapshot(PaginationState.page);
                dispatch([
                    new GetListaRichieste({ page: currentPage }),
                    new SetNeedRefresh(false)
                ]);
            } else {
                dispatch(new SetNeedRefresh(true));
            }
        }
    }

    @Action(AddRichiesta)
    addRichiesta({ getState, setState, dispatch }: StateContext<RichiesteStateModel>, { richiesta }: AddRichiesta): void {
        const state = getState();
        const beforePosition = state.richieste.length > 0 ? 0 : null;
        setState(
            patch({
                richieste: insertItem(richiesta, beforePosition)
            })
        );
        if (state.chiamataInviaPartenza) {
            /**
             * controllo che ci sia in pending una chiamata appena inserita da farci una composizione partenza
             */
            if (richiesta && richiesta.codice === state.chiamataInviaPartenza) {
                dispatch(new StartInviaPartenzaFromChiamata(richiesta));
            }
        }
    }

    @Action(SetIdChiamataInviaPartenza)
    setIdChiamataInviaPartenza({ patchState, dispatch }: StateContext<RichiesteStateModel>, action: SetIdChiamataInviaPartenza): void {
        patchState({
            chiamataInviaPartenza: action.richiesta.codice
        });
        dispatch(new StartInviaPartenzaFromChiamata(action.richiesta));
    }

    @Action(ClearIdChiamataInviaPartenza)
    clearIdChiamataInviaPartenza({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            chiamataInviaPartenza: RichiesteStateDefaults.chiamataInviaPartenza
        });
    }

    @Action(StartInviaPartenzaFromChiamata)
    startInviaPartenzaFromChiamata({ dispatch }: StateContext<RichiesteStateModel>): void {
        dispatch([
            new ClearIdChiamataInviaPartenza(),
            new SetRedirectComposizionePartenza(false),
        ]);
    }

    @Action(ActionMezzo)
    actionMezzo({ dispatch }: StateContext<RichiesteStateModel>, action: ActionMezzo): void {
        dispatch(new StartLoadingActionMezzo(action.mezzoAction.mezzo.codice));
        const obj = {
            codRichiesta: action.mezzoAction.codRichiesta,
            codicePartenza: action.mezzoAction.codicePartenza,
            idMezzo: action.mezzoAction.mezzo.codice,
            statoMezzo: action.mezzoAction.action ? action.mezzoAction.action : calcolaActionSuggeritaMezzo(action.mezzoAction.mezzo.stato),
            dataOraAggiornamento: action.mezzoAction.data
        } as any;
        if (action.mezzoAction.azioneIntervento) {
            obj.azioneIntervento = action.mezzoAction.azioneIntervento;
        }
        this.richiesteService.aggiornaStatoMezzo(obj).subscribe(() => {
                setAnnullaStatoMezzi();
                dispatch(new StopLoadingActionMezzo(action.mezzoAction.mezzo.codice));
            },
            (error: HttpErrorResponse) => {
                if (error?.error?.message === 'Errore servizio ESRI') {
                    setAnnullaStatoMezzi();
                }
                dispatch(new StopLoadingActionMezzo(action.mezzoAction.mezzo.codice));
            }
        );

        function setAnnullaStatoMezzi(): void {
            if (obj.statoMezzo === StatoMezzo.Rientrato) {
                dispatch([
                    new RemoveAnnullaStatoMezzi([action.mezzoAction.mezzo.codice], StatoMezzo.SulPosto),
                    new RemoveAnnullaStatoMezzi([action.mezzoAction.mezzo.codice], StatoMezzo.InRientro),
                ]);
            }
            if (!action.mezzoAction.modificaOrario && obj.statoMezzo !== StatoMezzo.Rientrato) {
                dispatch(new AddAnnullaStatoMezzi(action.mezzoAction.mezzo.codice, obj.statoMezzo));
            } else if (action.mezzoAction.modificaOrario && obj.statoMezzo !== StatoMezzo.Rientrato) {
                dispatch(new RemoveAnnullaStatoMezzi([action.mezzoAction.mezzo.codice]));
            }
        }
    }

    @Action(ActionRichiesta)
    actionRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: ActionRichiesta): void {
        dispatch(new StartLoadingActionRichiesta(action.richiestaAction.idRichiesta));
        this.richiesteService.aggiornaStatoRichiesta(action.richiestaAction).subscribe(() => {
        }, () => dispatch(new StopLoadingActionRichiesta(action.richiestaAction.idRichiesta)));
    }

    @Action(ModificaStatoFonogramma)
    modificaStatoFonogramma({ dispatch }: StateContext<RichiesteStateModel>, action: ModificaStatoFonogramma): void {
        dispatch(new StartLoadingModificaFonogramma());
        const obj = {
            idRichiesta: action.event.idRichiesta,
            numeroFonogramma: action.event.numeroFonogramma,
            protocolloFonogramma: action.event.protocolloFonogramma,
            destinatari: action.event.destinatari,
            stato: getStatoFonogrammaEnumByName(action.event.stato)
        };
        this.richiesteService.modificaStatoFonogrammaRichiesta(obj).subscribe(() => {
            dispatch(new StopLoadingModificaFonogramma());
        }, () => dispatch(new StopLoadingModificaFonogramma()));
    }

    @Action(AllertaSede)
    allertaSede({ dispatch }: StateContext<RichiesteStateModel>, action: AllertaSede): void {
        const obj = {
            codiceRichiesta: action.event.codRichiesta,
            codSediAllertate: action.event.sedi,
            motivazione: action.event.motivazione,
            generiMezzi: action.event.generiMezzi,
        };
        this.richiesteService.allertaSede(obj).subscribe(() => {
            dispatch(new UpdateFormValue({
                path: 'allertaSede.allertaSedeForm',
                value: {}
            }));
        }, () => {
            dispatch(new UpdateFormValue({
                path: 'allertaSede.allertaSedeForm',
                value: {}
            }));
        });
    }

    @Action(SetRichiestaById)
    setRichiestaById({ patchState, dispatch }: StateContext<RichiesteStateModel>, action: SetRichiestaById): void {
        this.richiesteService.getRichiestaById(action.idRichiesta).subscribe((data: SintesiRichiesta) => {
            patchState({
                richiestaById: data
            });
        });
    }

    @Action(ClearRichiestaById)
    clearRichiestaById({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            richiestaById: RichiesteStateDefaults.richiestaById
        });
    }

    @Action(SetRichiestaAzioni)
    setRichiestaAzioni({ patchState }: StateContext<RichiesteStateModel>, action: SetRichiestaAzioni): void {
        this.richiesteService.getRichiestaById(action.idRichiesta).subscribe((data: SintesiRichiesta) => {
            patchState({
                richiestaAzioni: data
            });
        });
    }

    @Action(ClearRichiestaAzioni)
    clearRichiestaAzioni({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            richiestaAzioni: RichiesteStateDefaults.richiestaAzioni
        });
    }

    @Action(VisualizzaListaSquadrePartenza)
    visualizzaListaSquadrePartenza({}: StateContext<RichiesteStateModel>, action: VisualizzaListaSquadrePartenza): void {
        let modal;
        modal = this.modalService.open(ListaSquadrePartenzaComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'xl',
            backdrop: true,
        });
        modal.componentInstance.codiceMezzo = action.codiceMezzo;
        modal.componentInstance.listaSquadre = action.listaSquadre;
    }

    @Action(StartLoadingRichieste)
    startLoadingRichieste({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            loadingRichieste: true
        });
    }

    @Action(StopLoadingRichieste)
    stopLoadingRichieste({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            loadingRichieste: false
        });
    }

    @Action(StartLoadingActionMezzo)
    startLoadingActionMezzo({ setState }: StateContext<RichiesteStateModel>, action: StartLoadingActionMezzo): void {
        setState(
            patch({
                loadingActionMezzo: append([action.idMezzo])
            })
        );
    }

    @Action(StopLoadingActionMezzo)
    stopLoadingActionMezzo({ setState }: StateContext<RichiesteStateModel>, action: StopLoadingActionMezzo): void {
        setState(
            patch({
                loadingActionMezzo: removeItem<string>(idMezzo => idMezzo === action.idMezzo)
            })
        );
    }

    @Action(StartLoadingActionRichiesta)
    startLoadingActionRichiesta({ setState }: StateContext<RichiesteStateModel>, action: StartLoadingActionRichiesta): void {
        setState(
            patch({
                loadingActionRichiesta: append([action.idRichiesta])
            })
        );
    }

    @Action(StopLoadingActionRichiesta)
    stopLoadingActionRichiesta({ setState }: StateContext<RichiesteStateModel>, action: StopLoadingActionRichiesta): void {
        setState(
            patch({
                loadingActionRichiesta: removeItem<string>(idRichiesta => idRichiesta === action.idRichiesta)
            })
        );
    }

    @Action(StartLoadingModificaFonogramma)
    startLoadingModificaFonogramma({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            loadingModificaFonogramma: true
        });
    }

    @Action(StopLoadingModificaFonogramma)
    stopLoadingModificaFonogramma({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            loadingModificaFonogramma: false
        });
    }
}
