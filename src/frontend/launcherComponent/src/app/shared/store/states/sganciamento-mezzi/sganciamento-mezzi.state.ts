import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StartListaComposizioneLoading } from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { Injectable } from '@angular/core';
import { MezziInServizioService } from '../../../../core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { ClearListaMezziSganciamento, GetListaMezziSganciamento, SetListaMezziSganciamento, StartLoadingMezziSganciamento, StopLoadingMezziSganciamento } from '../../actions/sganciamento-mezzi/sganciamento-mezzi.actions';
import { ResponseInterface } from '../../../interface/response/response.interface';
import { MezzoInServizio } from '../../../interface/mezzo-in-servizio.interface';
import { StatoMezzo } from '../../../enum/stato-mezzo.enum';

export interface SganciamentoMezziStateModel {
    mezzi: MezzoInServizio[];
    loadingMezzi: boolean;
}

export const SganciamentoMezziStateDefaults: SganciamentoMezziStateModel = {
    mezzi: null,
    loadingMezzi: false
};

@Injectable()
@State<SganciamentoMezziStateModel>({
    name: 'sganciamentoMezzi',
    defaults: SganciamentoMezziStateDefaults
})
export class SganciamentoMezziState {

    @Selector()
    static mezzi(state: SganciamentoMezziStateModel): MezzoInServizio[] {
        return state.mezzi;
    }

    @Selector()
    static loadingMezzi(state: SganciamentoMezziStateModel): boolean {
        return state.loadingMezzi;
    }

    constructor(private mezziInServizioService: MezziInServizioService) {
    }

    @Action(GetListaMezziSganciamento)
    getListaMezziSganciamento({ dispatch }: StateContext<SganciamentoMezziStateModel>): void {
        dispatch(new StartLoadingMezziSganciamento());
        const filters = {
            search: '',
            statiMezzo: [StatoMezzo.InViaggio, StatoMezzo.SulPosto, StatoMezzo.InRientro]
        };
        const pagination = {
            page: 1,
            pageSize: 30
        };
        this.mezziInServizioService.getMezziInServizio(filters, pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new SetListaMezziSganciamento(response?.dataArray),
                new StopLoadingMezziSganciamento()
            ]);
        });
    }

    @Action(SetListaMezziSganciamento)
    setListaMezziSganciamento({ patchState, dispatch }: StateContext<SganciamentoMezziStateModel>, action: SetListaMezziSganciamento): void {
        patchState({
            mezzi: action.listaMezzi
        });
    }

    @Action(ClearListaMezziSganciamento)
    clearListaMezziSganciamento({ patchState }: StateContext<SganciamentoMezziStateModel>): void {
        patchState({
            mezzi: SganciamentoMezziStateDefaults.mezzi
        });
    }

    @Action(StartLoadingMezziSganciamento)
    startLoadingMezziSganciamento({ patchState }: StateContext<SganciamentoMezziStateModel>): void {
        patchState({
            loadingMezzi: true
        });
    }

    @Action(StopLoadingMezziSganciamento)
    stopLoadingMezziSganciamento({ patchState }: StateContext<SganciamentoMezziStateModel>): void {
        patchState({
            loadingMezzi: false
        });
    }
}
