import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import {
    ActionMezzo, ActionRichiesta,
    AddRichiesta, CambiaStatoRichiesta, ClearIdChiamataInviaPartenza, ClearRichiestaById,
    ClearRichieste,
    GetListaRichieste,
    PatchRichiesta,
    SetIdChiamataInviaPartenza, SetRichiestaById,
    AddRichieste,
    StartInviaPartenzaFromChiamata,
    UpdateRichiesta, VisualizzaListaSquadrePartenza
} from '../../actions/richieste/richieste.actions';
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { append, iif, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { RichiestaFissataState } from './richiesta-fissata.state';
import { RichiestaHoverState } from './richiesta-hover.state';
import { RichiestaSelezionataState } from './richiesta-selezionata.state';
import { RichiestaModificaState } from './richiesta-modifica.state';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SuccessRichiestaModifica } from '../../actions/richieste/richiesta-modifica.actions';
import {
    RichiestaComposizione,
    UpdateRichiestaComposizione
} from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ToggleComposizione } from '../../actions/view/view.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { ComposizionePartenzaState } from '../composizione-partenza/composizione-partenza.state';
import { ClearRichiesteEspanse } from '../../actions/richieste/richieste-espanse.actions';
import { RichiesteEspanseState } from './richieste-espanse.state';
import { calcolaActionSuggeritaMezzo, makeCopy, randomNumber } from '../../../../../shared/helper/function';
import { RichiestaGestioneState } from './richiesta-gestione.state';
import { RichiestaAttivitaUtenteState } from './richiesta-attivita-utente.state';
import { ListaSquadrePartenzaComponent } from '../../../../../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RicercaRichiesteState } from '../filterbar/ricerca-richieste.state';
import { StartLoading, StopLoading } from '../../../../../shared/store/actions/loading/loading.actions';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { FiltriRichiesteState } from '../filterbar/filtri-richieste.state';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';

export interface RichiesteStateModel {
    richieste: SintesiRichiesta[];
    richiestaById: SintesiRichiesta;
    chiamataInviaPartenza: string;
}

export const RichiesteStateDefaults: RichiesteStateModel = {
    richieste: [],
    richiestaById: null,
    chiamataInviaPartenza: null
};

@State<RichiesteStateModel>({
    name: 'richieste',
    defaults: RichiesteStateDefaults,
    children: [RichiestaFissataState,
        RichiestaHoverState,
        RichiestaSelezionataState,
        RichiestaModificaState,
        RichiesteEspanseState,
        RichiestaGestioneState,
        RichiestaAttivitaUtenteState]
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

    constructor(private richiesteService: SintesiRichiesteService,
                private modalService: NgbModal,
                private store: Store) {
    }

    @Action(GetListaRichieste, { cancelUncompleted: true })
    getRichieste({ getState, dispatch }: StateContext<RichiesteStateModel>, action: GetListaRichieste) {
        dispatch(new StartLoading());
        const filters = {
            search: this.store.selectSnapshot(RicercaRichiesteState.ricerca),
            others: this.store.selectSnapshot(FiltriRichiesteState.filtriRichiesteSelezionati)
        };
        const pagination = {
            page: action.options && action.options.page ? action.options.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        // this.richiesteService.getRichieste(filters, pagination).subscribe((response: ResponseInterface) => {
        //     dispatch(new AddRichieste(response.dataArray));
        //     dispatch(new PatchPagination(response.pagination));
        //     dispatch(new StopLoading());
        // }, () => {
        //     dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5));
        //     dispatch(new StopLoading());
        // });

        // TEST
        // TODO: da eliminare
        const pageSize = this.store.selectSnapshot(PaginationState.pageSize);
        console.warn('AddRichieste');
        let richieste = makeCopy(getState().richieste);
        console.log('richieste length', richieste.length);
        richieste.forEach((r: SintesiRichiesta, index: number) => {
            if (index < pageSize) {
                r.id += randomNumber(1, 500000);
                r.codice += randomNumber(1, 500000);
                r.codiceRichiesta += randomNumber(1, 500000);
            }
        });
        richieste = richieste.filter((r: SintesiRichiesta, index: number) => index < pageSize);
        dispatch(new AddRichieste(richieste, action.position));
        setTimeout(() => dispatch(new StopLoading()), 500);
    }

    @Action(PatchRichiesta)
    patchRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: PatchRichiesta) {
        this.richiesteService.patchRichiesta(action.richiesta).subscribe(() => {
            dispatch(new SuccessRichiestaModifica);
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(AddRichieste)
    setRichieste({ getState, setState, patchState, dispatch }: StateContext<RichiesteStateModel>, action: AddRichieste) {
        const currentPage = this.store.selectSnapshot(PaginationState.page);
        const pageSize = this.store.selectSnapshot(PaginationState.pageSize);
        let richieste = makeCopy(getState().richieste);

        switch (action.position) {
            case 'top':
                if (currentPage === 2) {
                    richieste = richieste.filter((r: SintesiRichiesta, index: number) => index < pageSize);
                    patchState({
                        richieste: richieste
                    });
                } else if (currentPage > 2) {
                    richieste = richieste.filter((r: SintesiRichiesta, index: number) => index < pageSize * 2);
                    patchState({
                        richieste: richieste
                    });
                }
                richieste = makeCopy(getState().richieste);
                richieste.unshift(...action.richieste);
                patchState({
                    richieste: richieste
                });
                dispatch(new PatchPagination({ page: currentPage - 1, pageSize: pageSize }));
                break;
            case 'bottom':
                if (currentPage > 2) {
                    richieste = richieste.filter((r: SintesiRichiesta, index: number) => index >= pageSize);
                    patchState({
                        richieste: richieste
                    });
                }
                setState(
                    patch({
                        richieste: append(action.richieste)
                    })
                );
                dispatch(new PatchPagination({ page: currentPage + 1, pageSize: pageSize }));
                break;
        }
    }

    @Action(ClearRichieste)
    clearRichieste({ patchState, dispatch }: StateContext<RichiesteStateModel>) {
        dispatch(new ClearRichiesteEspanse());
        patchState(RichiesteStateDefaults);
    }

    @Action(UpdateRichiesta)
    updateRichiesta({ setState, dispatch }: StateContext<RichiesteStateModel>, { richiesta }: UpdateRichiesta) {
        // Controllo se la richiesta aggiornata è anche la richiesta attualmente in composzione
        const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        if (richiestaComposizione && richiestaComposizione.id === richiesta.id) {
            // console.log('richiesta', richiesta);
            dispatch(new UpdateRichiestaComposizione(richiesta));
            // dispatch(new ClearBoxPartenze());
            // dispatch(new AddBoxPartenza());
        }
        if (richiesta) {
            setState(
                patch({
                    richieste: updateItem<SintesiRichiesta>(r => r.id === richiesta.id, richiesta)
                })
            );
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
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore Aggiornamento Stato Richiesta', 'Il server web non risponde', 5)));
    }

    @Action(SetIdChiamataInviaPartenza)
    setIdChiamataInviaPartenza({ getState, patchState, dispatch }: StateContext<RichiesteStateModel>, action: SetIdChiamataInviaPartenza) {
        const state = getState();
        patchState({
            chiamataInviaPartenza: action.chiamataInviaPartenza
        });
        const chiamataInviaPartenza = state.richieste.filter(value => value.codice === action.chiamataInviaPartenza);
        if (chiamataInviaPartenza.length === 1) {
            dispatch(new StartInviaPartenzaFromChiamata(chiamataInviaPartenza[0]));
        }
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
        const obj = {
            'chiamata': action.mezzoAction.richiesta,
            'idMezzo': action.mezzoAction.mezzo.codice,
            'statoMezzo': action.mezzoAction.action ? action.mezzoAction.action : calcolaActionSuggeritaMezzo(action.mezzoAction.mezzo.stato),
            // 'listaMezzi': action.mezzoAction.listaMezzi ? true : false
        };
        console.log('Obj', obj);
        this.richiesteService.aggiornaStatoMezzo(obj).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(ActionRichiesta)
    actionRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: ActionRichiesta) {
        const obj = action.richiestaAction;
        console.log('Obj', obj);
        this.richiesteService.aggiornaStatoRichiesta(obj).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetRichiestaById)
    setRichiestaById({ patchState, dispatch }: StateContext<RichiesteStateModel>, action: SetRichiestaById) {
        this.richiesteService.getRichiestaById(action.idRichiesta).subscribe((data: SintesiRichiesta) => {
            patchState({
                richiestaById: data
            });
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
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

}
