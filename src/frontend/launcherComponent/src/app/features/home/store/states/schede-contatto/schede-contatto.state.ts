import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import {
    ClearFiltriSchedeContatto,
    ClearListaSchedeContatto,
    ClearSchedaContattoHover,
    ClearSchedaContattoSelezionata,
    ClearSchedaContattoTelefonata,
    GetContatoriSchedeContatto,
    GetListaSchedeContatto,
    InsertSchedeContatto,
    OpenDettaglioSchedaContatto,
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
    SetSchedaContattoSelezionata,
    SetSchedaContattoTelefonata,
    SetTabAttivo,
    StartLoadingDettaglioSchedaContatto,
    StartLoadingSchedeContatto,
    StopLoadingDettaglioSchedaContatto,
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
import { GetCodiciRichieste } from '../../../../../shared/store/actions/gestisci-scheda-contatto-modal/gestisci-scheda-contatto-modal.actions';
import { GestisciSchedaContattoModalComponent } from '../../../../../shared/modal/gestisci-scheda-contatto-modal/gestisci-scheda-contatto-modal.component';
import { GestisciSchedaContattoModalState } from '../../../../../shared/store/states/gestisci-scheda-contatto-modal/gestisci-scheda-contatto-modal.state';
import { ResetForm } from '@ngxs/form-plugin';

export interface SchedeContattoStateModel {
    contatoriSchedeContatto: ContatoriSchedeContatto;
    schedeContatto: SchedaContatto[];
    schedaContattoTelefonata: SchedaContatto;
    codiceSchedaContattoHover: string;
    codiceSchedaContattoSelezionata: string;
    filtriSchedeContatto: VoceFiltro[];
    filtriSelezionati: FiltersSchedeContatto;
    tabAttivo: ClassificazioneSchedaContatto;
    idVisualizzati: string[];
    idCollapsed: string[];
    loadingSchedeContatto: boolean;
    loadingDettaglioSchedeContatto: string;
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
    loadingDettaglioSchedeContatto: undefined,
    schedaContattoTelefonata: undefined,
    codiceSchedaContattoHover: undefined,
    codiceSchedaContattoSelezionata: undefined,
    filtriSchedeContatto: [
        new VoceFiltro('1', Categoria.Gestione, 'Gestita', false),
        new VoceFiltro('2', Categoria.Gestione, 'Non Gestita', false, true),
        new VoceFiltro('3', Categoria.DataRicezione, RangeSchedeContattoEnum.Ultime24, false),
        new VoceFiltro('4', Categoria.DataRicezione, RangeSchedeContattoEnum.Ultime48, false, true),
        new VoceFiltro('5', Categoria.DataRicezione, RangeSchedeContattoEnum.Ultimi30, false),
    ],
    filtriSelezionati: {
        gestita: false,
        rangeVisualizzazione: RangeSchedeContattoEnum.Ultime48
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
    static loadingDettaglioSchedeContatto(state: SchedeContattoStateModel): string {
        return state.loadingDettaglioSchedeContatto;
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
    static codiceSchedaContattoSelezionata(state: SchedeContattoStateModel): string {
        return state.codiceSchedaContattoSelezionata;
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

    @Action(GetContatoriSchedeContatto)
    getContatoriSchedeContatto({ dispatch }: StateContext<SchedeContattoStateModel>, action: GetContatoriSchedeContatto): void {
        dispatch(new StartLoadingSchedeContatto());
        this.schedeContattoService.getContatoriSchedeContatto(action.filters).subscribe((data: { infoNue: ContatoriSchedeContatto }) => {
            dispatch([
                new SetContatoriSchedeContatto(data.infoNue),
                new StopLoadingSchedeContatto()
            ]);
        });
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
        switch (rangeVisualizzazione) {
            case RangeSchedeContattoEnum.Ultime24:
                rangeVisualizzazione = 24;
                break;
            case RangeSchedeContattoEnum.Ultime48:
                rangeVisualizzazione = 48;
                break;
            case RangeSchedeContattoEnum.Ultimi30:
                rangeVisualizzazione = 1860;
                break;
        }
        const classificazione = state.tabAttivo;
        const filters = {
            search,
            gestita,
            rangeVisualizzazione,
            classificazione
        } as FiltersInterface;
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: boxesVisibili ? 11 : 12
        } as PaginationInterface;

        const filtersContatori = {
            search,
            gestita,
            rangeVisualizzazione
        } as FiltersInterface;
        dispatch(new GetContatoriSchedeContatto(filtersContatori));
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
    setSchedaContattoGestita({ patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoGestita): void {
        if (action.gestita === true) {
            dispatch(new GetCodiciRichieste());
            this.ngZone.run(() => {
                const modal = this.modal.open(GestisciSchedaContattoModalComponent, {
                        windowClass: 'modal-holder',
                        backdropClass: 'light-blue-backdrop',
                        centered: true,
                        backdrop: true
                    }
                );
                modal.result.then((res: string) => {
                    switch (res) {
                        case 'ok':
                            const formValueGestioneSchedaContatto = this.store.selectSnapshot(GestisciSchedaContattoModalState.formValue);
                            this.schedeContattoService.setSchedaContattoGestita(action.schedaContatto, action.gestita, formValueGestioneSchedaContatto.codiceRichiesta).subscribe(() => {
                                dispatch(new ResetForm({ path: 'gestisciSchedaContattoModal.gestisciSchedaContattoForm' }));
                            }, () => dispatch(new ResetForm({ path: 'gestisciSchedaContattoModal.gestisciSchedaContattoForm' })));
                            break;
                        case 'ko':
                            dispatch(new ResetForm({ path: 'gestisciSchedaContattoModal.gestisciSchedaContattoForm' }));
                            break;
                    }
                });
            });
        } else if (action.gestita === false) {
            this.schedeContattoService.setSchedaContattoGestita(action.schedaContatto, action.gestita, action.schedaContatto.codiceInterventoAssociato).subscribe(() => {
            });
        }
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

    @Action(SetSchedaContattoSelezionata)
    setSchedaContattoSelezionata({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoSelezionata): void {
        patchState({
            codiceSchedaContattoSelezionata: action.codiceSchedaContatto
        });
    }

    @Action(ClearSchedaContattoSelezionata)
    clearSchedaContattoSelezionata({ patchState }: StateContext<SchedeContattoStateModel>): void {
        patchState({
            codiceSchedaContattoSelezionata: null
        });
    }

    @Action(ReducerSetFiltroSchedeContatto)
    reducerSetFiltroSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: ReducerSetFiltroSchedeContatto): void {
        switch (action.filtro.codice) {
            case '1':
                if (action.filtro.selezionato) {
                    dispatch(new SetFiltroGestitaSchedeContatto(false));
                }
                break;
            case '2':
                if (action.filtro.selezionato) {
                    dispatch(new SetFiltroGestitaSchedeContatto(true));
                }
                break;
            case '3':
                if (!action.filtro.selezionato) {
                    dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.Ultime24));
                }
                break;
            case '4':
                if (!action.filtro.selezionato) {
                    dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.Ultime48));
                }
                break;
            case '5':
                if (!action.filtro.selezionato) {
                    dispatch(new SetRangeVisualizzazioneSchedeContatto(RangeSchedeContattoEnum.Ultimi30));
                }
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
                ...state.filtriSelezionati,
                rangeVisualizzazione: action.range
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(SaveMergeSchedeContatto)
    saveMergeSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: SaveMergeSchedeContatto): void {
        this.schedeContattoService.mergeSchedeContatto(action.schedeSelezionateId).subscribe(() => {
            dispatch(new ClearMergeSchedeContatto());
        });
    }

    @Action(UndoMergeSchedeContatto)
    undoMergeSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: UndoMergeSchedeContatto): void {
        console.log('Id Scheda Contato Undo Merge', action.codiceScheda);
        const undoMergeSchedaContatto = getState().schedeContatto.filter(value => value.codiceScheda === action.codiceScheda)[0];
        this.schedeContattoService.undoMergeSchedeContatto(undoMergeSchedaContatto).subscribe(() => {
            console.log('Undo Merge Schede completata', undoMergeSchedaContatto);
            dispatch(new ClearMergeSchedeContatto());
        });
    }

    @Action(OpenDettaglioSchedaContatto)
    openDettaglioSchedaContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: OpenDettaglioSchedaContatto): void {
        const state = getState();
        const schedaContattoDetail = state.schedeContatto?.length ? state.schedeContatto.filter(value => value.codiceScheda === action.codiceScheda)[0] : null;
        if (schedaContattoDetail) {
            this.ngZone.run(() => {
                const modal = this.modal.open(DettaglioSchedaContattoModalComponent, {
                        windowClass: 'xxlModal modal-holder',
                        backdropClass: 'light-blue-backdrop',
                        centered: true,
                        backdrop: true
                    }
                );
                modal.componentInstance.schedaContatto = schedaContattoDetail;
            });
        } else {
            dispatch(new StartLoadingDettaglioSchedaContatto(action.codiceScheda));
            this.schedeContattoService.getSchedaContatto(action.codiceScheda).subscribe((schedaContatto: SchedaContatto) => {
                this.ngZone.run(() => {
                    const modal = this.modal.open(DettaglioSchedaContattoModalComponent, {
                            windowClass: 'xxlModal modal-holder',
                            backdropClass: 'light-blue-backdrop',
                            centered: true,
                            backdrop: true
                        }
                    );
                    modal.componentInstance.schedaContatto = schedaContatto;
                });
                dispatch(new StopLoadingDettaglioSchedaContatto());
            }, () => dispatch(new StopLoadingDettaglioSchedaContatto()));
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

    @Action(StartLoadingDettaglioSchedaContatto)
    startLoadingDettaglioSchedaContatto({ patchState }: StateContext<SchedeContattoStateModel>, action: StartLoadingDettaglioSchedaContatto): void {
        patchState({
            loadingDettaglioSchedeContatto: action.codiceScheda
        });
    }

    @Action(StopLoadingDettaglioSchedaContatto)
    stopLoadingDettaglioSchedaContatto({ patchState }: StateContext<SchedeContattoStateModel>): void {
        patchState({
            loadingDettaglioSchedeContatto: SchedeContattoStateDefaults.loadingDettaglioSchedeContatto
        });
    }
}
