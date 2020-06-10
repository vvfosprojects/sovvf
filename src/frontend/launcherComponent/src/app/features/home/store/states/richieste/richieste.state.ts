import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import {
    ActionMezzo,
    ActionRichiesta,
    AddRichiesta,
    CambiaStatoRichiesta,
    ClearIdChiamataInviaPartenza,
    ClearRichiestaById,
    ClearRichieste,
    GetListaRichieste,
    PatchRichiesta,
    SetIdChiamataInviaPartenza,
    SetRichiestaById,
    AddRichieste,
    StartInviaPartenzaFromChiamata,
    UpdateRichiesta,
    VisualizzaListaSquadrePartenza,
    SetNeedRefresh,
    StartLoadingRichieste,
    StopLoadingRichieste,
    EliminaPartenzaRichiesta, StartLoadingActionMezzo, StopLoadingActionMezzo
} from '../../actions/richieste/richieste.actions';
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';
import { RichiestaFissataState } from './richiesta-fissata.state';
import { RichiestaHoverState } from './richiesta-hover.state';
import { RichiestaSelezionataState } from './richiesta-selezionata.state';
import { RichiestaModificaState } from './richiesta-modifica.state';
import { ClearIndirizzo, SuccessRichiestaModifica } from '../../actions/richieste/richiesta-modifica.actions';
import { RichiestaComposizione, UpdateRichiestaComposizione } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ToggleComposizione } from '../../actions/view/view.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { ComposizionePartenzaState } from '../composizione-partenza/composizione-partenza.state';
import { ClearRichiesteEspanse } from '../../actions/richieste/richieste-espanse.actions';
import { RichiesteEspanseState } from './richieste-espanse.state';
import { calcolaActionSuggeritaMezzo } from '../../../../../shared/helper/function';
import { RichiestaGestioneState } from './richiesta-gestione.state';
import { RichiestaAttivitaUtenteState } from './richiesta-attivita-utente.state';
import { ListaSquadrePartenzaComponent } from '../../../../../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RicercaFilterbarState } from '../filterbar/ricerca-filterbar.state';
import { FiltriRichiesteState } from '../filterbar/filtri-richieste.state';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response.interface';
import { ClearRichiestaSelezionata } from '../../actions/richieste/richiesta-selezionata.actions';
import { ClearRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { ClearRichiestaHover } from '../../actions/richieste/richiesta-hover.actions';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { ClearRichiestaMarkerModifica } from '../../actions/maps/richieste-markers.actions';

export interface RichiesteStateModel {
    richieste: SintesiRichiesta[];
    richiestaById: SintesiRichiesta;
    chiamataInviaPartenza: string;
    loadingRichieste: boolean;
    loadingActionMezzo: string;
    needRefresh: boolean;
}

export const RichiesteStateDefaults: RichiesteStateModel = {
    richieste: [],
    richiestaById: null,
    chiamataInviaPartenza: null,
    loadingRichieste: false,
    loadingActionMezzo: null,
    needRefresh: false
};

@State<RichiesteStateModel>({
    name: 'richieste',
    defaults: RichiesteStateDefaults,
    children: [
        RichiestaFissataState,
        RichiestaHoverState,
        RichiestaSelezionataState,
        RichiestaModificaState,
        RichiesteEspanseState,
        RichiestaGestioneState,
        RichiestaAttivitaUtenteState
    ]
})
export class RichiesteState {

    @Selector()
    static richieste(state: RichiesteStateModel) {
        return state.richieste;
    }

    @Selector()
    static getRichiestaById(state: RichiesteStateModel) {
        return state.richiestaById;
    }

    @Selector()
    static richiestaById(state: RichiesteStateModel) {
        return (id: string) => state.richieste.find(x => x.id === id);
    }

    @Selector()
    static needRefresh(state: RichiesteStateModel) {
        return state.needRefresh;
    }

    @Selector()
    static loadingRichieste(state: RichiesteStateModel) {
        return state.loadingRichieste;
    }

    @Selector()
    static loadingActionMezzo(state: RichiesteStateModel) {
        return state.loadingActionMezzo;
    }

    constructor(private richiesteService: SintesiRichiesteService,
                private modalService: NgbModal,
                private store: Store) {
    }

    @Action(GetListaRichieste, { cancelUncompleted: true })
    getRichieste({ getState, dispatch }: StateContext<RichiesteStateModel>, action: GetListaRichieste) {
        const state = getState();
        const utente = this.store.selectSnapshot(x => x.utente.utente);
        if (utente) {
            dispatch(new StartLoadingRichieste());
            const filters = {
                search: this.store.selectSnapshot(RicercaFilterbarState.ricerca),
                others: this.store.selectSnapshot(FiltriRichiesteState.filtriRichiesteSelezionati)
            };
            const pagination = {
                page: action.options && action.options.page ? action.options.page : 1,
                pageSize: 7
            };
            this.richiesteService.getRichieste(filters, pagination).subscribe((response: ResponseInterface) => {
                dispatch([
                    new AddRichieste(response.sintesiRichiesta),
                    new PatchPagination(response.pagination),
                    new StopLoadingRichieste()
                ]);
                if (state.needRefresh) {
                    dispatch(new SetNeedRefresh(false));
                }
            }, () => {
                dispatch(new StopLoadingRichieste());
            });

            // Clear dei dati presenti nella pagina che si sta lasciando
            dispatch([
                new ClearRichiestaSelezionata(),
                new ClearRichiestaHover(),
                new ClearRichiesteEspanse()
            ]);
            const richiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione);
            if (richiestaGestione) {
                dispatch(new ClearRichiestaGestione(richiestaGestione.id));
            }
        }
    }

    @Action(PatchRichiesta)
    patchRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: PatchRichiesta) {
        action.richiesta.richiedente.telefono = action.richiesta.richiedente.telefono.toString();
        this.richiesteService.patchRichiesta(action.richiesta).subscribe(() => {
            dispatch(new SuccessRichiestaModifica);
        }, () => {
            dispatch([
                new ClearIndirizzo(),
                new ClearRichiestaMarkerModifica(),
                new GetInitCentroMappa()
            ]);
        });
    }

    @Action(AddRichieste)
    setRichieste({ patchState }: StateContext<RichiesteStateModel>, action: AddRichieste) {
        patchState({
            richieste: action.richieste
        });
    }

    @Action(ClearRichieste)
    clearRichieste({ patchState, dispatch }: StateContext<RichiesteStateModel>) {
        dispatch(new ClearRichiesteEspanse());
        patchState(RichiesteStateDefaults);
    }


    @Action(SetNeedRefresh)
    setNeedRefresh({ getState, patchState }: StateContext<RichiesteStateModel>, action: SetNeedRefresh) {
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
    updateRichiesta({ setState, dispatch }: StateContext<RichiesteStateModel>, action: UpdateRichiesta) {
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

            const idRichiestaSelezionata = this.store.selectSnapshot(RichiestaSelezionataState.idRichiestaSelezionata);
            const idRichiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.idRichiestaGestione);
            if (!idRichiestaSelezionata && !idRichiestaGestione) {
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
    addRichiesta({ getState, setState, dispatch }: StateContext<RichiesteStateModel>, { richiesta }: AddRichiesta) {
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

    @Action(CambiaStatoRichiesta)
    cambiaStatoRichiesta({ patchState, dispatch }: StateContext<RichiesteStateModel>, action: CambiaStatoRichiesta) {
        const obj = {
            'idRichiesta': action.idRichiesta,
            'stato': action.stato
        };
        this.richiesteService.aggiornaStatoRichiesta(obj).subscribe(() => {
        });
    }

    @Action(SetIdChiamataInviaPartenza)
    setIdChiamataInviaPartenza({ patchState, dispatch }: StateContext<RichiesteStateModel>, action: SetIdChiamataInviaPartenza) {
        patchState({
            chiamataInviaPartenza: action.richiesta.codice
        });
        dispatch(new StartInviaPartenzaFromChiamata(action.richiesta));
    }

    @Action(ClearIdChiamataInviaPartenza)
    clearIdChiamataInviaPartenza({ patchState }: StateContext<RichiesteStateModel>) {
        patchState({
            chiamataInviaPartenza: RichiesteStateDefaults.chiamataInviaPartenza
        });
    }

    @Action(StartInviaPartenzaFromChiamata)
    startInviaPartenzaFromChiamata({ dispatch, patchState }: StateContext<RichiesteStateModel>, action: StartInviaPartenzaFromChiamata) {
        dispatch([
            new ClearIdChiamataInviaPartenza(),
            new ToggleComposizione(Composizione.Avanzata),
            new SetMarkerRichiestaSelezionato(action.richiesta.id),
            new RichiestaComposizione(action.richiesta)
        ]);
    }

    @Action(ActionMezzo)
    actionMezzo({ dispatch }: StateContext<RichiesteStateModel>, action: ActionMezzo) {
        dispatch(new StartLoadingActionMezzo(action.mezzoAction.mezzo.codice));
        const obj = {
            'codRichiesta': action.mezzoAction.codRichiesta,
            'idMezzo': action.mezzoAction.mezzo.codice,
            'statoMezzo': action.mezzoAction.action ? action.mezzoAction.action : calcolaActionSuggeritaMezzo(action.mezzoAction.mezzo.stato),
        };
        this.richiesteService.aggiornaStatoMezzo(obj).subscribe(() => {
        });
    }

    @Action(EliminaPartenzaRichiesta)
    eliminaPartenzaRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: EliminaPartenzaRichiesta) {
        const obj = {
            'idRichiesta': action.idRichiesta,
            'targaMezzo': action.targaMezzo,
            'codMotivazione': action.motivazione.codMotivazione,
            'testoMotivazione': action.motivazione.testoMotivazione ? action.motivazione.testoMotivazione : null,
            'codRichiestaSubentrata': action.motivazione.codRichiestaSubentrata ? action.motivazione.codRichiestaSubentrata : null
        };
        this.richiesteService.eliminaPartenzaRichiesta(obj).subscribe(() => {
        });
    }

    @Action(ActionRichiesta)
    actionRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: ActionRichiesta) {
        const obj = action.richiestaAction;
        console.log('Obj', obj);
        this.richiesteService.aggiornaStatoRichiesta(obj).subscribe(() => {
        });
    }

    @Action(SetRichiestaById)
    setRichiestaById({ patchState, dispatch }: StateContext<RichiesteStateModel>, action: SetRichiestaById) {
        this.richiesteService.getRichiestaById(action.idRichiesta).subscribe((data: SintesiRichiesta) => {
            patchState({
                richiestaById: data
            });
        });
    }

    @Action(ClearRichiestaById)
    clearRichiestaById({ patchState }: StateContext<RichiesteStateModel>) {
        patchState({
            richiestaById: RichiesteStateDefaults.richiestaById
        });
    }

    @Action(VisualizzaListaSquadrePartenza)
    visualizzaListaSquadrePartenza({ patchState }: StateContext<RichiesteStateModel>, action: VisualizzaListaSquadrePartenza) {
        const modal = this.modalService.open(ListaSquadrePartenzaComponent, { windowClass: 'squadrePartenza', backdropClass: 'light-blue-backdrop', centered: true });
        modal.componentInstance.listaSquadre = action.listaSquadre;
        modal.result.then(() => console.log('Lista Squadre Partenza Aperta'),
            () => console.log('Lista Squadre Partenza Chiusa'));
    }

    @Action(StartLoadingRichieste)
    startLoadingRichieste({ patchState }: StateContext<RichiesteStateModel>) {
        patchState({
            loadingRichieste: true
        });
    }

    @Action(StopLoadingRichieste)
    stopLoadingRichieste({ patchState }: StateContext<RichiesteStateModel>) {
        patchState({
            loadingRichieste: false
        });
    }

    @Action(StartLoadingActionMezzo)
    startLoadingActionMezzo({ patchState }: StateContext<RichiesteStateModel>, action: StartLoadingActionMezzo) {
        patchState({
            loadingActionMezzo: action.idMezzo
        });
    }

    @Action(StopLoadingActionMezzo)
    stopLoadingActionMezzo({ patchState }: StateContext<RichiesteStateModel>) {
        patchState({
            loadingActionMezzo: null
        });
    }

}
