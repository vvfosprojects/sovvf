import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import {
    ClearFiltriSchedeContatto,
    ClearListaSchedeContatto,
    ClearSchedaContattoHover,
    ClearSchedaContattoTelefonata,
    GeneraListaSchedeContatto,
    GetListaSchedeContatto,
    InsertSchedeContatto,
    OpenDetailSC,
    ReducerSetFiltroSchedeContatto,
    RemoveSchedeContatto,
    ResetFiltriSelezionatiSchedeContatto,
    SaveMergeSchedeContatto,
    SetContatoriSchedeContatto,
    SetFiltroGestitaSchedeContatto,
    SetFiltroSelezionatoSchedaContatto,
    SetIdVisualizzati,
    SetListaSchedeContatto,
    SetRangeVisualizzazioneSchedeContatto,
    SetSchedaContattoGestita,
    SetSchedaContattoHover,
    SetSchedaContattoTelefonata,
    SetTabAttivo,
    StartLoadingSchedeContatto,
    StopLoadingSchedeContatto,
    ToggleCollapsed,
    UndoMergeSchedeContatto,
    UpdateSchedaContatto
} from '../../actions/schede-contatto/schede-contatto.actions';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';
import { SchedeContattoService } from '../../../../../core/service/schede-contatto/schede-contatto.service';
import { FiltersSchedeContattoInterface } from '../../../../../shared/interface/filters/filters-schede-contatto.interface';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';
import { makeCopy } from '../../../../../shared/helper/function';
import {
    resetFiltriSelezionati as _resetFiltriSelezionati,
    setFiltroSelezionato as _setFiltroSelezionato
} from '../../../../../shared/helper/function-filtro';
import { CategoriaFiltriSchedeContatto as Categoria } from '../../../../../shared/enum/categoria-filtri-schede-contatto';
import { ContatoreSchedeContatto, ContatoriSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';
import { ContatoriSchedeContattoModel } from '../../../../../shared/model/contatori-schede-contatto.model';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { RangeSchedeContattoEnum } from '../../../../../shared/enum/range-schede-contatto';
import { MergeSchedeContattoState } from './merge-schede-contatto.state';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ClearMergeSchedeContatto } from '../../actions/schede-contatto/merge-schede-contatto.actions';
import { RefreshSchedeContattoMarkers, ToggleOpacitaSchedeContattoMarkers } from '../../actions/maps/schede-contatto-markers.actions';
import { DettaglioSchedaModalComponent } from '../../../schede-contatto/dettaglio-scheda-modal/dettaglio-scheda-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, NgZone } from '@angular/core';
import { ClearMarkerSCSelezionato } from '../../actions/maps/marker.actions';
import { FiltersInterface } from '../../../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../../../shared/interface/pagination.interface';
import { RicercaFilterbarState } from '../filterbar/ricerca-filterbar.state';
import { ResponseInterface } from '../../../../../shared/interface/response.interface';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ImpostazioniState } from '../../../../../shared/store/states/impostazioni/impostazioni.state';

export interface SchedeContattoStateModel {
    contatoriSchedeContatto: ContatoriSchedeContatto;
    schedeContatto: SchedaContatto[];
    idSchedeContattoCompetenza: string[];
    idSchedeContattoConoscenza: string[];
    idSchedeContattoDifferibili: string[];
    schedaContattoTelefonata: SchedaContatto;
    codiceSchedaContattoHover: string;
    filtriSchedeContatto: VoceFiltro[];
    filtriSelezionati: FiltersSchedeContattoInterface;
    tabAttivo: ClassificazioneSchedaContatto;
    idVisualizzati: string[];
    idCollapsed: string[];
    loadingSchedeContatto: boolean;
}

export const SchedeContattoEmpty = {
    schedeContatto: [],
    idSchedeContattoCompetenza: [],
    idSchedeContattoConoscenza: [],
    idSchedeContattoDifferibili: [],
    tabAttivo: null,
    idVisualizzati: [],
    idCollapsed: [],
    loadingSchedeContatto: false
};

export const SchedeContattoStateDefaults: SchedeContattoStateModel = {
    contatoriSchedeContatto: new ContatoriSchedeContattoModel(),
    ...SchedeContattoEmpty,
    schedaContattoTelefonata: undefined,
    codiceSchedaContattoHover: undefined,
    filtriSchedeContatto: [
        new VoceFiltro('1', Categoria.Gestione, 'Gestita', false),
        new VoceFiltro('2', Categoria.Gestione, 'Non Gestita', false),
        new VoceFiltro('3', Categoria.Gestione, 'Ultima ora', false),
        new VoceFiltro('4', Categoria.Gestione, 'Ultime 2 ore', false),
        new VoceFiltro('5', Categoria.Gestione, 'Ultime 24 ore', false),
        new VoceFiltro('6', Categoria.Gestione, 'Da sempre', false),
    ],
    filtriSelezionati: {
        gestita: undefined,
        recenti: '',
        rangeVisualizzazione: RangeSchedeContattoEnum.DaSempre
    }
};

@Injectable()
@State<SchedeContattoStateModel>({
    name: 'schedeContatto',
    defaults: SchedeContattoStateDefaults,
    children: [MergeSchedeContattoState]
})
export class SchedeContattoState {

    @Selector()
    static loadingSchedeContatto(state: SchedeContattoStateModel): boolean {
        return state.loadingSchedeContatto;
    }

    @Selector()
    static contatoreSchedeContattoTotale(state: SchedeContattoStateModel): ContatoreSchedeContatto {
        return state.contatoriSchedeContatto.totaleSchede;
    }

    @Selector()
    static contatoreSchedeContattoCompetenza(state: SchedeContattoStateModel): ContatoreSchedeContatto {
      return state.contatoriSchedeContatto.competenzaSchede;
    }

    @Selector()
    static contatoreSchedeContattoConoscenza(state: SchedeContattoStateModel): ContatoreSchedeContatto {
      return state.contatoriSchedeContatto.conoscenzaSchede;
    }

    @Selector()
    static contatoreSchedeContattoDifferibile(state: SchedeContattoStateModel): ContatoreSchedeContatto {
      return state.contatoriSchedeContatto.differibileSchede;
    }

    @Selector()
    static contatoriSchedeContatto(state: SchedeContattoStateModel): ContatoriSchedeContatto {
        return state.contatoriSchedeContatto;
    }

    @Selector()
    static schedeContatto(state: SchedeContattoStateModel): SchedaContatto[] {
        return state.schedeContatto;
    }

    @Selector()
    static idSchedeCompetenza(state: SchedeContattoStateModel): string[] {
        return state.idSchedeContattoCompetenza;
    }

    @Selector()
    static idSchedeConoscenza(state: SchedeContattoStateModel): string[] {
        return state.idSchedeContattoConoscenza;
    }

    @Selector()
    static idSchedeDifferibili(state: SchedeContattoStateModel): string[] {
        return state.idSchedeContattoDifferibili;
    }

    @Selector()
    static idVisualizzati(state: SchedeContattoStateModel): string[] {
        return state.idVisualizzati;
    }

    @Selector()
    static idCollapsed(state: SchedeContattoStateModel): string[] {
        return state.idCollapsed;
    }

    @Selector()
    static schedaContattoTelefonata(state: SchedeContattoStateModel): SchedaContatto {
        return state.schedaContattoTelefonata;
    }

    @Selector()
    static numeroSchedeContattoCompetenza(state: SchedeContattoStateModel): number {
        return state.idSchedeContattoCompetenza.length;
    }

    @Selector()
    static codiceSchedaContattoHover(state: SchedeContattoStateModel): string {
        return state.codiceSchedaContattoHover;
    }

    @Selector()
    static filtriSchedeContatto(state: SchedeContattoStateModel): VoceFiltro[] {
        return state.filtriSchedeContatto;
    }

    @Selector()
    static filtriSelezionati(state: SchedeContattoStateModel): VoceFiltro[] {
        return state.filtriSchedeContatto.filter(f => f.selezionato === true);
    }

    @Selector()
    static rangeVisualizzazione(state: SchedeContattoStateModel): RangeSchedeContattoEnum | number {
        return state.filtriSelezionati.rangeVisualizzazione;
    }

    @Selector()
    static tabAttivo(state: SchedeContattoStateModel): string {
        if (state.tabAttivo) {
            return state.tabAttivo;
        } else {
            return 'Tutte';
        }
    }

    constructor(private schedeContattoService: SchedeContattoService,
                private modal: NgbModal,
                private ngZone: NgZone,
                private store: Store) {
    }

    @Action(SetContatoriSchedeContatto)
    setContatoriSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>, action: SetContatoriSchedeContatto): void {
        patchState({
            contatoriSchedeContatto: action.contatori
        });
    }

    @Action(GetListaSchedeContatto)
    getListaSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: GetListaSchedeContatto): void {
        dispatch(new StartLoadingSchedeContatto());
        const state = getState();
        const gestita = state.filtriSelezionati.gestita;
        const recenti = state.filtriSelezionati.recenti;
        const search = this.store.selectSnapshot(RicercaFilterbarState.ricerca);
        const boxesVisibili = this.store.selectSnapshot(ImpostazioniState.boxAttivi);
        let rangeVisualizzazione = state.filtriSelezionati.rangeVisualizzazione;
        if (state.filtriSelezionati.rangeVisualizzazione !== RangeSchedeContattoEnum.DaSempre) {
            switch (rangeVisualizzazione) {
                case RangeSchedeContattoEnum.UltimaOra:
                    rangeVisualizzazione = 1;
                    break;
                case RangeSchedeContattoEnum.UltimeDueOre:
                    rangeVisualizzazione = 2;
                    break;
                case RangeSchedeContattoEnum.UltimoGiorno:
                    rangeVisualizzazione = 24;
                    break;
            }
        }
        const filters = {
            search,
            gestita,
            recenti,
            rangeVisualizzazione: rangeVisualizzazione !== RangeSchedeContattoEnum.DaSempre ? rangeVisualizzazione : null
        } as FiltersInterface;
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: boxesVisibili ? 13 : 15
        } as PaginationInterface;
        this.schedeContattoService.getSchedeContatto(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new SetListaSchedeContatto(response.dataArray),
                new PatchPagination(response.pagination),
                new StopLoadingSchedeContatto()
            ]);
        });
    }

    @Action(SetListaSchedeContatto)
    setListaSchedeContatto({ patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetListaSchedeContatto): void {
        patchState({
            schedeContatto: action.schedeContatto
        });
        dispatch(new GeneraListaSchedeContatto());
    }

    @Action(GeneraListaSchedeContatto)
    generaListaSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>): void {
        const state = getState();
        if (state?.schedeContatto?.length > 0) {
            patchState({
                idSchedeContattoCompetenza: state.schedeContatto.filter(scheda => scheda.classificazione === ClassificazioneSchedaContatto.Competenza).map(value => value.codiceScheda),
                idSchedeContattoConoscenza: state.schedeContatto.filter(scheda => scheda.classificazione === ClassificazioneSchedaContatto.Conoscenza).map(value => value.codiceScheda),
                idSchedeContattoDifferibili: state.schedeContatto.filter(scheda => scheda.classificazione === ClassificazioneSchedaContatto.Differibile).map(value => value.codiceScheda)
            });
            dispatch(new SetIdVisualizzati());
        }
    }

    @Action(ClearListaSchedeContatto)
    clearListaSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>): void {
        patchState(SchedeContattoEmpty);
    }

    @Action(UpdateSchedaContatto)
    updateSchedaContatto({ setState }: StateContext<SchedeContattoStateModel>, action: UpdateSchedaContatto): void {
        setState(
            patch({
                schedeContatto: updateItem<SchedaContatto>(s => s.codiceScheda === action.schedaContatto.codiceScheda, action.schedaContatto)
            })
        );
    }

    @Action(InsertSchedeContatto)
    insertSchedeContatto({ setState, dispatch }: StateContext<SchedeContattoStateModel>, action: InsertSchedeContatto): void {
        setState(
            patch({
                schedeContatto: append<SchedaContatto>((action.schedaContatto))
            })
        );
        dispatch(new GeneraListaSchedeContatto());
    }

    @Action(RemoveSchedeContatto)
    removeSchedeContatto({ setState }: StateContext<SchedeContattoStateModel>, { idSchedeRimosse }: RemoveSchedeContatto): void {
        console.log(idSchedeRimosse);
        idSchedeRimosse.forEach(idScheda => {
            setState(
                patch({
                    schedeContatto: removeItem<SchedaContatto>(scheda => scheda.codiceScheda === idScheda),
                    idSchedeContattoCompetenza: removeItem<string>(id => id === idScheda),
                    idSchedeContattoConoscenza: removeItem<string>(id => id === idScheda),
                    idSchedeContattoDifferibili: removeItem<string>(id => id === idScheda),
                    idVisualizzati: removeItem<string>(id => id === idScheda)
                })
            );
        });

    }

    @Action(SetTabAttivo)
    setTabAttivo({ patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetTabAttivo): void {
        if (action.tabAttivo) {
            patchState({
                tabAttivo: action.tabAttivo,
            });
            dispatch(new ToggleOpacitaSchedeContattoMarkers(true, action.tabAttivo));
        } else {
            patchState({
                tabAttivo: SchedeContattoStateDefaults.tabAttivo,
            });
            dispatch(new ToggleOpacitaSchedeContattoMarkers(false));
        }
        dispatch(new SetIdVisualizzati());
    }

    @Action(SetIdVisualizzati)
    setIdVisualizzati({ getState, patchState }: StateContext<SchedeContattoStateModel>): void {
        const state = getState();
        if (state.tabAttivo) {
            patchState({
                idVisualizzati: state.schedeContatto.filter(scheda => scheda.classificazione === state.tabAttivo).map(value => value.codiceScheda)
            });
        } else {
            patchState({
                idVisualizzati: [...state.idSchedeContattoCompetenza, ...state.idSchedeContattoConoscenza, ...state.idSchedeContattoDifferibili]
            });
        }
    }

    @Action(ToggleCollapsed)
    toggleCollapsed({ getState, setState }: StateContext<SchedeContattoStateModel>, action: ToggleCollapsed): void {
        const state = getState();
        if (state.idCollapsed.length === 0 || !state.idCollapsed.includes(action.codiceScheda)) {
            setState(
                patch({
                    idCollapsed: insertItem<string>(action.codiceScheda)
                })
            );
        } else {
            setState(
                patch({
                    idCollapsed: removeItem<string>(id => id === action.codiceScheda)
                })
            );
        }
    }

    @Action(SetSchedaContattoGestita)
    setSchedaContattoGestita({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoGestita): void {
        this.schedeContattoService.setSchedaContattoGestita(action.schedaContatto, action.gestita).subscribe(() => {
        });
    }

    @Action(SetSchedaContattoTelefonata)
    setSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoTelefonata): void {
        patchState({
            schedaContattoTelefonata: action.schedaContatto
        });
    }

    @Action(ClearSchedaContattoTelefonata)
    clearSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>): void {
        patchState({
            schedaContattoTelefonata: null
        });
    }

    @Action(SetSchedaContattoHover)
    setSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoHover): void {
        patchState({
            codiceSchedaContattoHover: action.codiceSchedaContatto
        });
    }

    @Action(ClearSchedaContattoHover)
    clearSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>): void {
        patchState({
            codiceSchedaContattoHover: null
        });
    }

    @Action(ReducerSetFiltroSchedeContatto)
    reducerSetFiltroSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: ReducerSetFiltroSchedeContatto): void {
        const state = getState();
        switch (action.filtro.codice) {
            case '1':
                state.filtriSelezionati.gestita === true ? dispatch(new SetFiltroGestitaSchedeContatto(null)) : dispatch(new SetFiltroGestitaSchedeContatto(true));
                break;
            case '2':
                state.filtriSelezionati.gestita === false ? dispatch(new SetFiltroGestitaSchedeContatto(null)) : dispatch(new SetFiltroGestitaSchedeContatto(false));
                break;
            case '3':
              state.filtriSelezionati.recenti ? dispatch(new SetFiltroGestitaSchedeContatto(null, '1')) : dispatch(new SetFiltroGestitaSchedeContatto(false, '0'));
              break;
            case '4':
              state.filtriSelezionati.recenti ? dispatch(new SetFiltroGestitaSchedeContatto(null, '2')) : dispatch(new SetFiltroGestitaSchedeContatto(false, '0'));
              break;
            case '5':
                state.filtriSelezionati.recenti ? dispatch(new SetFiltroGestitaSchedeContatto(null, '3')) : dispatch(new SetFiltroGestitaSchedeContatto(false, '0'));
                break;
            case '6':
              state.filtriSelezionati.recenti ? dispatch(new SetFiltroGestitaSchedeContatto(null, '0')) : dispatch(new SetFiltroGestitaSchedeContatto(false, '0'));
              break;
              default:
                console.error('[Errore Switch] ReducerSetFiltroSchedeContatto');
                break;
        }
        dispatch(new SetFiltroSelezionatoSchedaContatto(action.filtro));
    }

    @Action(SetFiltroGestitaSchedeContatto)
    setFiltroGestitaSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetFiltroGestitaSchedeContatto): void {
        const state = getState();
        switch (action.recenti) {
          case '0':
            patchState({
              filtriSelezionati: {
                ...state.filtriSelezionati,
                gestita: action.gestita,
                recenti: '0',
                rangeVisualizzazione: RangeSchedeContattoEnum.DaSempre
              }
            });
            dispatch(new GetListaSchedeContatto());
            break;
            case '1':
              patchState({
                filtriSelezionati: {
                  ...state.filtriSelezionati,
                  gestita: action.gestita,
                  recenti: '1',
                  rangeVisualizzazione: RangeSchedeContattoEnum.UltimaOra
                }
              });
              dispatch(new GetListaSchedeContatto());
              break;
            case '2':
              patchState({
                filtriSelezionati: {
                  ...state.filtriSelezionati,
                  gestita: action.gestita,
                  recenti: '2',
                  rangeVisualizzazione: RangeSchedeContattoEnum.UltimeDueOre
                }
              });
              dispatch(new GetListaSchedeContatto());
              break;
            case '3':
              patchState({
                filtriSelezionati: {
                  ...state.filtriSelezionati,
                  gestita: action.gestita,
                  recenti: '3',
                  rangeVisualizzazione: RangeSchedeContattoEnum.UltimoGiorno
                }
              });
              dispatch(new GetListaSchedeContatto());
              break;
            default:
              patchState({
                filtriSelezionati: {
                  ...state.filtriSelezionati,
                  gestita: action.gestita,
                  recenti: '0',
                  rangeVisualizzazione: RangeSchedeContattoEnum.DaSempre
                }
              });
              dispatch(new GetListaSchedeContatto());
              break;
        }
    }

    @Action(ClearFiltriSchedeContatto)
    clearFiltriSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>): void {
        const state = getState();
        patchState({
            filtriSelezionati: {
                ...state.filtriSelezionati,
                gestita: null,
                recenti: '0',
            }
        });
        dispatch([
            new GetListaSchedeContatto(), new ResetFiltriSelezionatiSchedeContatto()
        ]);
    }

    @Action(SetFiltroSelezionatoSchedaContatto)
    setFiltroSelezionato({ getState, patchState }: StateContext<SchedeContattoStateModel>, action: SetFiltroSelezionatoSchedaContatto): void {
        const state = getState();
        const filtriSchedeContatto = makeCopy(state.filtriSchedeContatto);
        const filtro = makeCopy(action.filtro);
        patchState({
            ...state,
            filtriSchedeContatto: _setFiltroSelezionato(filtriSchedeContatto, filtro)
        });
    }

    @Action(ResetFiltriSelezionatiSchedeContatto)
    resetFiltriSelezionati({ getState, patchState }: StateContext<SchedeContattoStateModel>): void {
        const state = getState();
        const filtriSchedeContatto = makeCopy(state.filtriSchedeContatto);
        patchState({
            ...state,
            filtriSchedeContatto: _resetFiltriSelezionati(filtriSchedeContatto)
        });
    }

    @Action(SetRangeVisualizzazioneSchedeContatto)
    setRangeVisualizzazioneSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetRangeVisualizzazioneSchedeContatto): void {
        const state = getState();
        patchState({
            filtriSelezionati: {
                ...state.filtriSelezionati,
                rangeVisualizzazione: action.range
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(SaveMergeSchedeContatto)
    saveMergeSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: SaveMergeSchedeContatto): void {
        console.log('Id Schede contatto selezionate', action.schedeSelezionateId);
        const state = getState();
        const schedeSelezionate = state.schedeContatto.filter((value) => {
            if (action.schedeSelezionateId.includes(value.codiceScheda)) {
                return value;
            }
        }).sort((a, b) =>
            (a.priorita < b.priorita) ? 1 :
                (a.priorita === b.priorita) ? ((new Date(a.dataInserimento).getTime() > new Date(b.dataInserimento).getTime()) ? 1 : -1) : -1);
        const mergeSchedeContatto: SchedaContatto = {
            ...schedeSelezionate[0],
            collegate: [...schedeSelezionate.slice(1).map(value => {
                return {
                    ...value,
                    collegata: true
                };
            })]
        };
        this.schedeContattoService.mergeSchedeContatto(mergeSchedeContatto).subscribe(() => {
            console.log('Unione schede completata', mergeSchedeContatto);
            dispatch([
                new ClearMergeSchedeContatto(),
                new RefreshSchedeContattoMarkers(),
                new ShowToastr(ToastrType.Success, 'Unione schede contatto', 'Unione completata con successo', null, null, true)
            ]);
        });
    }

    @Action(UndoMergeSchedeContatto)
    undoMergeSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: UndoMergeSchedeContatto): void {
        console.log('Id Scheda Contato Undo Merge', action.codiceScheda);
        const undoMergeSchedaContatto = getState().schedeContatto.filter(value => value.codiceScheda === action.codiceScheda)[0];
        this.schedeContattoService.undoMergeSchedeContatto(undoMergeSchedaContatto).subscribe(() => {
            console.log('Undo Merge Schede completata', undoMergeSchedaContatto);
            dispatch([
                new ClearMergeSchedeContatto(),
                new RefreshSchedeContattoMarkers(),
                new ShowToastr(ToastrType.Success, 'Undo schede contatto', 'Rimozione raggruppamento completato con successo', null, null, true)
            ]);
        });
    }

    @Action(OpenDetailSC)
    openDetailSC({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: OpenDetailSC): void {
        const state = getState();
        const schedaContattoDetail = state.schedeContatto.filter(value => value.codiceScheda === action.codiceScheda)[0];
        this.ngZone.run(() => {
            const modal = this.modal.open(DettaglioSchedaModalComponent,
                { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true }
            );
            modal.componentInstance.schedaContatto = schedaContattoDetail;
            modal.result.then(
                () => {
                },
                () => dispatch(new ClearMarkerSCSelezionato())
            );
        });
    }

    @Action(StartLoadingSchedeContatto)
    startLoadingSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>): void {
        patchState({
            loadingSchedeContatto: true
        });
    }

    @Action(StopLoadingSchedeContatto)
    stopLoadingSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>): void {
        patchState({
            loadingSchedeContatto: false
        });
    }
}
