import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import {
    ClearFiltriSchedeContatto,
    ClearListaSchedeContatto,
    ClearSchedaContattoHover,
    ClearSchedaContattoTelefonata,
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
import { FiltersSchedeContatto } from '../../../../../shared/interface/filters/filters-schede.contatto';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import { setFiltroSelezionato as _setFiltroSelezionato } from '../../../../../shared/helper/function-filtro';
import { CategoriaFiltriSchedeContatto as Categoria } from '../../../../../shared/enum/categoria-filtri-schede-contatto';
import { ContatoreSchedeContatto, ContatoriSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';
import { ContatoriSchedeContattoModel } from '../../../../../shared/model/contatori-schede-contatto.model';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { RangeSchedeContattoEnum } from '../../../../../shared/enum/range-schede-contatto';
import { MergeSchedeContattoState } from './merge-schede-contatto.state';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ClearMergeSchedeContatto } from '../../actions/schede-contatto/merge-schede-contatto.actions';
import { DettaglioSchedaContattoModalComponent } from '../../../../../shared/modal/dettaglio-scheda-contatto-modal/dettaglio-scheda-contatto-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, NgZone } from '@angular/core';
import { FiltersInterface } from '../../../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../../../shared/interface/pagination.interface';
import { RicercaFilterbarState } from '../filterbar/ricerca-filterbar.state';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ImpostazioniState } from '../../../../../shared/store/states/impostazioni/impostazioni.state';
import { ViewComponentState } from '../view/view.state';

export interface SchedeContattoStateModel {
    contatoriSchedeContatto: ContatoriSchedeContatto;
    schedeContatto: SchedaContatto[];
    schedaContattoTelefonata: SchedaContatto;
    codiceSchedaContattoHover: string;
    filtriSchedeContatto: VoceFiltro[];
    filtriSelezionati: FiltersSchedeContatto;
    tabAttivo: ClassificazioneSchedaContatto;
    idVisualizzati: string[];
    idCollapsed: string[];
    loadingSchedeContatto: boolean;
}

export const SchedeContattoEmpty = {
    schedeContatto: [],
    tabAttivo: ClassificazioneSchedaContatto.Competenza,
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
        new VoceFiltro('3', Categoria.DataRicezione, RangeSchedeContattoEnum.UltimaOra, false),
        new VoceFiltro('4', Categoria.DataRicezione, RangeSchedeContattoEnum.UltimeDueOre, false),
        new VoceFiltro('5', Categoria.DataRicezione, RangeSchedeContattoEnum.UltimoGiorno, false),
    ],
    filtriSelezionati: {
        gestita: undefined,
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
    static contatoriSchedeContatto(state: SchedeContattoStateModel): ContatoriSchedeContatto {
        return state.contatoriSchedeContatto;
    }

    @Selector()
    static schedeContatto(state: SchedeContattoStateModel): SchedaContatto[] {
        return state.schedeContatto;
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
        const classificazione = state.tabAttivo;
        const filters = {
            search,
            gestita,
            rangeVisualizzazione: rangeVisualizzazione !== RangeSchedeContattoEnum.DaSempre ? rangeVisualizzazione : null,
            classificazione
        } as FiltersInterface;
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: boxesVisibili ? 11 : 14
        } as PaginationInterface;
        this.schedeContattoService.getSchedeContatto(filters, pagination).subscribe((response: ResponseInterface) => {
            const schedeContattoActive = this.store.selectSnapshot(ViewComponentState.schedeContattoStatus);
            const chiamataActive = this.store.selectSnapshot(ViewComponentState.chiamataStatus);
            if (schedeContattoActive || chiamataActive) {
                dispatch([
                    new SetListaSchedeContatto(response.dataArray),
                    new PatchPagination(response.pagination),
                ]);
            }
            dispatch(new StopLoadingSchedeContatto());
        });
    }

    @Action(SetListaSchedeContatto)
    setListaSchedeContatto({ patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetListaSchedeContatto): void {
        patchState({
            schedeContatto: action.schedeContatto,
            idVisualizzati: action.schedeContatto.map(value => value.codiceScheda)
        });
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
    }

    @Action(RemoveSchedeContatto)
    removeSchedeContatto({ getState, setState }: StateContext<SchedeContattoStateModel>, { idSchedeRimosse }: RemoveSchedeContatto): void {
        console.log(idSchedeRimosse);
        const state = getState();
        idSchedeRimosse.forEach((idScheda: string) => {
            const idVisualizzati = state.idVisualizzati;
            const idPresente = idVisualizzati.filter((id: string) => id === idScheda)[0];
            if (idPresente) {
                setState(
                    patch({
                        schedeContatto: removeItem<SchedaContatto>(scheda => scheda.codiceScheda === idScheda),
                        idVisualizzati: removeItem<string>(id => id === idScheda)
                    })
                );
            }
        });

    }

    @Action(SetTabAttivo)
    setTabAttivo({ patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetTabAttivo): void {
        patchState({
            tabAttivo: action.tabAttivo,
        });
        dispatch(new GetListaSchedeContatto());
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
        const filtroGestita = state.filtriSelezionati.gestita;
        const filtroRangeVisualizzazione = state.filtriSelezionati.rangeVisualizzazione;
        switch (action.filtro.codice) {
            case '1':
                filtroGestita === true ? dispatch(new SetFiltroGestitaSchedeContatto(null)) : dispatch(new SetFiltroGestitaSchedeContatto(true));
                break;
            case '2':
                filtroGestita === false ? dispatch(new SetFiltroGestitaSchedeContatto(null)) : dispatch(new SetFiltroGestitaSchedeContatto(false));
                break;
            case '3':
                filtroRangeVisualizzazione === RangeSchedeContattoEnum.UltimaOra ? dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.DaSempre)) : dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.UltimaOra));
                break;
            case '4':
                filtroRangeVisualizzazione === RangeSchedeContattoEnum.UltimeDueOre ? dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.DaSempre)) : dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.UltimeDueOre));
                break;
            case '5':
                filtroRangeVisualizzazione === RangeSchedeContattoEnum.UltimoGiorno ? dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.DaSempre)) : dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.UltimoGiorno));
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
        patchState({
            filtriSelezionati: {
                ...state.filtriSelezionati,
                gestita: action.gestita
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(ClearFiltriSchedeContatto)
    clearFiltriSchedeContatto({ patchState, dispatch }: StateContext<SchedeContattoStateModel>): void {
        patchState({
            filtriSelezionati: SchedeContattoStateDefaults.filtriSelezionati
        });
        dispatch([
            new GetListaSchedeContatto(),
            new ResetFiltriSelezionatiSchedeContatto()
        ]);
    }

    @Action(SetFiltroSelezionatoSchedaContatto)
    setFiltroSelezionato({ getState, patchState }: StateContext<SchedeContattoStateModel>, action: SetFiltroSelezionatoSchedaContatto): void {
        const state = getState();
        const filtriSchedeContatto = makeCopy(state.filtriSchedeContatto);
        const filtro = makeCopy(action.filtro);
        patchState({
            filtriSchedeContatto: _setFiltroSelezionato(filtriSchedeContatto, filtro)
        });
    }

    @Action(ResetFiltriSelezionatiSchedeContatto)
    resetFiltriSelezionati({ patchState }: StateContext<SchedeContattoStateModel>): void {
        patchState({
            filtriSchedeContatto: SchedeContattoStateDefaults.filtriSchedeContatto
        });
    }

    @Action(SetRangeVisualizzazioneSchedeContatto)
    setRangeVisualizzazioneSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetRangeVisualizzazioneSchedeContatto): void {
        const state = getState();
        const filtriSchedeContatto = makeCopy(state.filtriSchedeContatto);
        const filtro = makeCopy(action.range);
        patchState({
            filtriSchedeContatto: _setFiltroSelezionato(filtriSchedeContatto, filtro),
            filtriSelezionati: {
                rangeVisualizzazione: action.range
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(SaveMergeSchedeContatto)
    saveMergeSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: SaveMergeSchedeContatto): void {
        this.schedeContattoService.mergeSchedeContatto(action.schedeSelezionateId).subscribe(() => {
            dispatch([
                new ClearMergeSchedeContatto(),
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
                new ShowToastr(ToastrType.Success, 'Undo schede contatto', 'Rimozione raggruppamento completato con successo', null, null, true)
            ]);
        });
    }

    @Action(OpenDetailSC)
    openDetailSC({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: OpenDetailSC): void {
        const state = getState();
        const schedaContattoDetail = state.schedeContatto.filter(value => value.codiceScheda === action.codiceScheda)[0];
        const innerWidth = window.innerWidth;
        if (innerWidth && innerWidth > 3700) {
            this.ngZone.run(() => {
                const modal = this.modal.open(DettaglioSchedaContattoModalComponent,
                    {
                        windowClass: 'xxlModal modal-holder modal-left',
                        backdropClass: 'light-blue-backdrop',
                        centered: true,
                        backdrop: true,
                    }
                );
                modal.componentInstance.schedaContatto = schedaContattoDetail;
            });
        } else {
            this.ngZone.run(() => {
                const modal = this.modal.open(DettaglioSchedaContattoModalComponent,
                    {
                        windowClass: 'xxlModal modal-holder',
                        backdropClass: 'light-blue-backdrop',
                        centered: true,
                        backdrop: true,
                    }
                );
                modal.componentInstance.schedaContatto = schedaContattoDetail;
            });
        }
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
