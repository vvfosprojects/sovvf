import { State, Selector, Action, StateContext, Select, Store } from '@ngxs/store';
import { MezzoInServizio } from '../../../../../shared/interface/mezzo-in-servizio.interface';
import { MezziInServizioService } from '../../../../../core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';
import { StatoMezzo as Categoria } from '../../../../../shared/enum/stato-mezzo.enum';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import {
    resetFiltriSelezionati as _resetFiltriSelezionati,
    setFiltroSelezionato as _setFiltroSelezionato
} from '../../../../../shared/helper/function-filtro';
import { patch, updateItem } from '@ngxs/store/operators';
import {
    ClearFiltriMezziInServizio,
    ClearListaMezziInServizio,
    ClearMezzoInServizioHover,
    ClearMezzoInServizioSelezionato,
    GetListaMezziInServizio,
    SetFiltroMezziInServizio,
    SetMezziInServizio,
    SetMezzoInServizioHover,
    SetMezzoInServizioSelezionato,
    StartLoadingMezziInServizio,
    StopLoadingMezziInServizio,
    UpdateMezzoInServizio
} from '../../actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { FiltersInterface } from '../../../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../../../shared/interface/pagination.interface';
import { ImpostazioniState } from '../../../../../shared/store/states/impostazioni/impostazioni.state';
import { RicercaFilterbarState } from '../filterbar/ricerca-filterbar.state';
import { ViewComponentState } from '../view/view.state';

export interface MezziInServizioStateModel {
    mezziInServizio: MezzoInServizio[];
    mezziInServizioFiltered: MezzoInServizio[];
    idMezzoInServizioHover: string;
    idMezzoInServizioSelezionato: string;
    filtriMezziInServizio: VoceFiltro[];
    loadingMezziInServizio: boolean;
}

export const MezziInServizioStateDefaults: MezziInServizioStateModel = {
    mezziInServizio: null,
    mezziInServizioFiltered: null,
    idMezzoInServizioHover: null,
    idMezzoInServizioSelezionato: null,
    filtriMezziInServizio: [
        new VoceFiltro('3', Categoria.InSede, 'In Sede', false),
        new VoceFiltro('4', Categoria.InViaggio, 'In Viaggio', false),
        new VoceFiltro('6', Categoria.SulPosto, 'Sul Posto', false),
        new VoceFiltro('2', Categoria.InRientro, 'In Rientro', false),
        new VoceFiltro('1', Categoria.FuoriServizio, 'Fuori Servizio', false),
        new VoceFiltro('5', Categoria.Istituto, 'Istituto', false),
    ],
    loadingMezziInServizio: false
};

@Injectable()
@State<MezziInServizioStateModel>({
    name: 'mezziInServizio',
    defaults: MezziInServizioStateDefaults
})

export class MezziInServizioState {

    constructor(private mezziInServizioService: MezziInServizioService,
                private store: Store) {
    }

    @Selector()
    static idMezzoInServizioHover(state: MezziInServizioStateModel): string {
        return state.idMezzoInServizioHover;
    }

    @Selector()
    static idMezzoInServizioSelezionato(state: MezziInServizioStateModel): string {
        return state.idMezzoInServizioSelezionato;
    }

    @Selector()
    static mezziInServizio(state: MezziInServizioStateModel): MezzoInServizio[] {
        return state.mezziInServizio;
    }

    @Selector()
    static mezziInServizioFiltered(state: MezziInServizioStateModel): MezzoInServizio[] {
        return state.mezziInServizioFiltered;
    }

    @Selector()
    static filtriMezziInServizio(state: MezziInServizioStateModel): VoceFiltro[] {
        return state.filtriMezziInServizio;
    }

    @Selector()
    static filtriSelezionati(state: MezziInServizioStateModel): VoceFiltro[] {
        return state.filtriMezziInServizio.filter(f => f.selezionato === true);
    }

    @Selector()
    static loadingMezziInServizio(state: MezziInServizioStateModel): boolean {
        return state.loadingMezziInServizio;
    }

    @Action(GetListaMezziInServizio)
    getListaMezziInServizio({ getState, dispatch }: StateContext<MezziInServizioStateModel>, action: GetListaMezziInServizio): void {
        dispatch(new StartLoadingMezziInServizio());
        const state = getState();
        const ricerca = this.store.selectSnapshot(RicercaFilterbarState.ricerca);
        const statiMezzo = state.filtriMezziInServizio.filter((f: VoceFiltro) => f.selezionato === true).map((f: VoceFiltro) => f.descrizione);
        const boxesVisibili = this.store.selectSnapshot(ImpostazioniState.boxAttivi);
        const filters = {
            search: ricerca,
            statiMezzo: statiMezzo && statiMezzo.length > 0 ? statiMezzo : null
        } as FiltersInterface;
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: boxesVisibili ? 11 : 13
        } as PaginationInterface;
        this.mezziInServizioService.getMezziInServizio(filters, pagination).subscribe((response: ResponseInterface) => {
                const mezziInServizioActive = this.store.selectSnapshot(ViewComponentState.mezziInServizioStatus);
                if (mezziInServizioActive) {
                    dispatch([
                        new SetMezziInServizio(response.dataArray),
                        new PatchPagination(response.pagination)
                    ]);
                }
                dispatch(new StopLoadingMezziInServizio());
            },
            error => dispatch(new StopLoadingMezziInServizio())
        );
    }

    @Action(SetMezziInServizio)
    setMezziInServizio({ patchState }: StateContext<MezziInServizioStateModel>, action: SetMezziInServizio): void {
        patchState({
            mezziInServizio: action.mezzi,
            mezziInServizioFiltered: action.mezzi
        });
    }

    @Action(UpdateMezzoInServizio)
    updateMezzoInServizio({ setState, dispatch }: StateContext<MezziInServizioStateModel>, action: UpdateMezzoInServizio): void {
        setState(
            patch({
                    mezziInServizio: updateItem((m: MezzoInServizio) => m.mezzo.mezzo.codice === action.mezzo.mezzo.mezzo.codice, action.mezzo),
                    mezziInServizioFiltered: updateItem((m: MezzoInServizio) => m.mezzo.mezzo.codice === action.mezzo.mezzo.mezzo.codice, action.mezzo)
                }
            )
        );
        dispatch(new GetListaMezziInServizio());
    }

    @Action(SetFiltroMezziInServizio)
    setFiltroMezziInServizio({ getState, patchState, dispatch }: StateContext<MezziInServizioStateModel>, action: SetFiltroMezziInServizio): void {
        const state = getState();
        const filtriMezziInServizio = makeCopy(state.filtriMezziInServizio);
        const filtro = makeCopy(action.filtro);
        patchState({
            filtriMezziInServizio: _setFiltroSelezionato(filtriMezziInServizio, filtro)
        });
        dispatch(new GetListaMezziInServizio());
    }

    @Action(ClearFiltriMezziInServizio)
    clearFiltriMezziInServizio({ getState, patchState, dispatch }: StateContext<MezziInServizioStateModel>, action: ClearFiltriMezziInServizio): void {
        const state = getState();
        const filtriMezziInServizio = makeCopy(state.filtriMezziInServizio);
        patchState({
            ...state,
            filtriMezziInServizio: _resetFiltriSelezionati(filtriMezziInServizio)
        });
        if (!action.preventReloadLista) {
            dispatch(new GetListaMezziInServizio());
        }
    }

    @Action(SetMezzoInServizioHover)
    setMezzoInServizioHover({ patchState, dispatch }: StateContext<MezziInServizioStateModel>, action: SetMezzoInServizioHover): void {
        patchState({
            idMezzoInServizioHover: action.idMezzo
        });
    }

    @Action(ClearMezzoInServizioHover)
    clearMezzoInServizioHover({ patchState, dispatch }: StateContext<MezziInServizioStateModel>): void {
        patchState({
            idMezzoInServizioHover: null
        });
    }

    @Action(SetMezzoInServizioSelezionato)
    setMezzoInServizioSelezionato({ getState, patchState, dispatch }: StateContext<MezziInServizioStateModel>, action: SetMezzoInServizioSelezionato): void {
        const state = getState();
        if (state.idMezzoInServizioSelezionato !== action.idMezzo) {
            patchState({
                idMezzoInServizioSelezionato: action.idMezzo
            });
        } else {
            dispatch(new ClearMezzoInServizioSelezionato());
        }
    }

    @Action(ClearMezzoInServizioSelezionato)
    clearMezzoInServizioSelezionato({ patchState, dispatch }: StateContext<MezziInServizioStateModel>): void {
        patchState({
            idMezzoInServizioSelezionato: null
        });
    }

    @Action(ClearListaMezziInServizio)
    clearListaMezziInServizio({ patchState }: StateContext<MezziInServizioStateModel>): void {
        patchState({
            mezziInServizio: MezziInServizioStateDefaults.mezziInServizio,
            mezziInServizioFiltered: MezziInServizioStateDefaults.mezziInServizioFiltered,
        });
    }

    @Action(StartLoadingMezziInServizio)
    startLoadingMezziInServizio({ patchState }: StateContext<MezziInServizioStateModel>): void {
        patchState({
            loadingMezziInServizio: true
        });
    }

    @Action(StopLoadingMezziInServizio)
    stopLoadingMezziInServizio({ patchState }: StateContext<MezziInServizioStateModel>): void {
        patchState({
            loadingMezziInServizio: false
        });
    }
}
