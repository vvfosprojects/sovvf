import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import {
    ActionMezzo,
    ActionRichiesta,
    AddRichiesta,
    AddRichieste,
    AllertaSede,
    ClearIdChiamataInviaPartenza,
    ClearRichiestaById,
    ClearRichieste,
    EliminaPartenzaRichiesta,
    GetListaRichieste,
    ModificaStatoFonogramma,
    SetIdChiamataInviaPartenza,
    SetNeedRefresh,
    SetRichiestaById,
    StartInviaPartenzaFromChiamata,
    StartLoadingActionMezzo,
    StartLoadingActionRichiesta,
    StartLoadingEliminaPartenza,
    StartLoadingModificaFonogramma,
    StartLoadingRichieste,
    StopLoadingActionMezzo,
    StopLoadingActionRichiesta,
    StopLoadingEliminaPartenza,
    StopLoadingModificaFonogramma,
    StopLoadingRichieste,
    UpdateRichiesta,
    VisualizzaListaSquadrePartenza
} from '../../actions/richieste/richieste.actions';
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';
import { RichiestaFissataState } from './richiesta-fissata.state';
import { RichiestaHoverState } from './richiesta-hover.state';
import { RichiestaSelezionataState } from './richiesta-selezionata.state';
import { SetRichiestaComposizione, UpdateRichiestaComposizione } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ToggleComposizione } from '../../actions/view/view.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { ComposizionePartenzaState } from '../composizione-partenza/composizione-partenza.state';
import { RichiestaGestioneState } from './richiesta-gestione.state';
import { RichiestaAttivitaUtenteState } from './richiesta-attivita-utente.state';
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

export interface RichiesteStateModel {
    richieste: SintesiRichiesta[];
    richiestaById: SintesiRichiesta;
    chiamataInviaPartenza: string;
    loadingRichieste: boolean;
    loadingActionMezzo: string;
    loadingEliminaPartenza: boolean;
    loadingActionRichiesta: string;
    loadingModificaFonogramma: boolean;
    needRefresh: boolean;
}

export const RichiesteStateDefaults: RichiesteStateModel = {
    richieste: [],
    richiestaById: null,
    chiamataInviaPartenza: null,
    loadingRichieste: false,
    loadingEliminaPartenza: false,
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
        RichiestaGestioneState,
        RichiestaAttivitaUtenteState
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
    static needRefresh(state: RichiesteStateModel): boolean {
        return state.needRefresh;
    }

    @Selector()
    static loadingRichieste(state: RichiesteStateModel): boolean {
        return state.loadingRichieste;
    }

    @Selector()
    static loadingActionMezzo(state: RichiesteStateModel): string {
        return state.loadingActionMezzo;
    }

    @Selector()
    static loadingActionRichiesta(state: RichiesteStateModel): string {
        return state.loadingActionRichiesta;
    }

    @Selector()
    static loadingEliminaPartenza(state: RichiesteStateModel): boolean {
        return state.loadingEliminaPartenza;
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
            const filters = {
                search: this.store.selectSnapshot(RicercaFilterbarState.ricerca),
                others: this.store.selectSnapshot(FiltriRichiesteState.filtriRichiesteSelezionati),
                statiRichiesta: this.store.selectSnapshot(FiltriRichiesteState.filtriStatoRichiestaSelezionati)
            };
            const pagination = {
                page: action.options && action.options.page ? action.options.page : 1,
                pageSize: boxesVisibili ? 7 : 8
            };
            this.richiesteService.getRichieste(filters, pagination).subscribe((response: ResponseInterface) => {
                const richiesteActive = this.store.selectSnapshot(ViewComponentState.richiesteStatus);
                if (richiesteActive) {
                    dispatch([
                        new AddRichieste(response.sintesiRichiesta),
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
                dispatch(new ClearRichiestaGestione(richiestaGestione.id));
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

            if (state.loadingActionRichiesta && (action.richiesta.id === state.loadingActionRichiesta)) {
                dispatch(new StopLoadingActionRichiesta());
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
                console.log('Codice trovato:', richiesta.codice);
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
    startInviaPartenzaFromChiamata({ dispatch, patchState }: StateContext<RichiesteStateModel>, action: StartInviaPartenzaFromChiamata): void {
        dispatch([
            new ClearIdChiamataInviaPartenza(),
            new ToggleComposizione(Composizione.Avanzata),
            new SetMarkerRichiestaSelezionato(action.richiesta.id),
            new SetRichiestaComposizione(action.richiesta)
        ]);
    }

    @Action(ActionMezzo)
    actionMezzo({ dispatch }: StateContext<RichiesteStateModel>, action: ActionMezzo): void {
        dispatch(new StartLoadingActionMezzo(action.mezzoAction.mezzo.codice));
        const obj = {
            codRichiesta: action.mezzoAction.codRichiesta,
            idMezzo: action.mezzoAction.mezzo.codice,
            statoMezzo: action.mezzoAction.action ? action.mezzoAction.action : calcolaActionSuggeritaMezzo(action.mezzoAction.mezzo.stato),
            dataOraAggiornamento: action.mezzoAction.data
        } as any;
        if (action.mezzoAction.azioneIntervento) {
            obj.azioneIntervento = action.mezzoAction.azioneIntervento;
        }
        this.richiesteService.aggiornaStatoMezzo(obj).subscribe(() => {
                dispatch(new StopLoadingActionMezzo());
            },
            error => dispatch(new StopLoadingActionMezzo())
        );
    }

    @Action(EliminaPartenzaRichiesta)
    eliminaPartenzaRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: EliminaPartenzaRichiesta): void {
        dispatch(new StartLoadingEliminaPartenza());
        const obj = {
            idRichiesta: action.idRichiesta,
            targaMezzo: action.targaMezzo,
            codMotivazione: action.motivazione.codMotivazione,
            testoMotivazione: action.motivazione.testoMotivazione ? action.motivazione.testoMotivazione : null,
            codRichiestaSubentrata: action.motivazione.codRichiestaSubentrata ? action.motivazione.codRichiestaSubentrata : null
        };
        this.richiesteService.eliminaPartenzaRichiesta(obj).subscribe(() => {
            dispatch(new StopLoadingEliminaPartenza());
        }, error => dispatch(new StopLoadingEliminaPartenza()));
    }

    @Action(ActionRichiesta)
    actionRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: ActionRichiesta): void {
        dispatch(new StartLoadingActionRichiesta(action.richiestaAction.idRichiesta));
        const obj = action.richiestaAction;
        console.log('ActionRichiesta Obj', obj);
        this.richiesteService.aggiornaStatoRichiesta(obj).subscribe(() => {
        }, error => dispatch(new StopLoadingActionRichiesta()));
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
        }, error => dispatch(new StopLoadingModificaFonogramma()));
    }

    @Action(AllertaSede)
    allertaSede({ dispatch }: StateContext<RichiesteStateModel>, action: AllertaSede): void {
        const codSediAllertate = [];
        action.event.sedi.forEach(x => codSediAllertate.push(x.codice));
        const obj = {
            codiceRichiesta: action.event.codRichiesta,
            codSediAllertate,
            motivazione: action.event.motivazione,
        };
        console.log('***obj BE ', obj);
        this.richiesteService.allertaSede(obj).subscribe(() => {
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

    @Action(VisualizzaListaSquadrePartenza)
    visualizzaListaSquadrePartenza({ patchState }: StateContext<RichiesteStateModel>, action: VisualizzaListaSquadrePartenza): void {
        const innerWidth = window.innerWidth;
        let modal;
        if (innerWidth && innerWidth > 3700) {
            modal = this.modalService.open(ListaSquadrePartenzaComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg',
            });
        } else {
            modal = this.modalService.open(ListaSquadrePartenzaComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg',
            });
        }
        modal.componentInstance.listaSquadre = action.listaSquadre;
        modal.result.then(() => console.log('Lista Squadre Partenza Aperta'),
            () => console.log('Lista Squadre Partenza Chiusa'));
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
    startLoadingActionMezzo({ patchState }: StateContext<RichiesteStateModel>, action: StartLoadingActionMezzo): void {
        patchState({
            loadingActionMezzo: action.idMezzo
        });
    }

    @Action(StopLoadingActionMezzo)
    stopLoadingActionMezzo({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            loadingActionMezzo: null
        });
    }


    @Action(StartLoadingEliminaPartenza)
    startLoadingEliminaPartenza({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            loadingEliminaPartenza: true
        });
    }

    @Action(StopLoadingEliminaPartenza)
    stopLoadingEliminaPartenza({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            loadingEliminaPartenza: false
        });
    }

    @Action(StartLoadingActionRichiesta)
    startLoadingActionRichiesta({ patchState }: StateContext<RichiesteStateModel>, action: StartLoadingActionRichiesta): void {
        patchState({
            loadingActionRichiesta: action.idRichiesta
        });
    }

    @Action(StopLoadingActionRichiesta)
    stopLoadingActionRichiesta({ patchState }: StateContext<RichiesteStateModel>): void {
        patchState({
            loadingActionRichiesta: null
        });
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
