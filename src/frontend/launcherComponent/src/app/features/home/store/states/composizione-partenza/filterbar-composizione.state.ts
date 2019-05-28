import { Action, Selector, State, StateContext } from '@ngxs/store';

import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { AddFiltroSelezionatoComposizione, RemoveFiltriSelezionatiComposizione, RemoveFiltroSelezionatoComposizione } from '../../actions/composizione-partenza/filterbar-composizione.actions';
import { GetFiltriComposizione, SetFiltriComposizione } from '../../actions/composizione-partenza/filterbar-composizione.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { FilterbarComposizioneStateModel } from './filterbar-composizione.state';
import { FilterbarService } from '../../../../../core/service/comp-partenza-service/filterbar-composizione-service/filterbar.service';

export interface FilterbarComposizioneStateModel {
    filtri: any;
    codiceDistaccamento: any[];
    codiceTipoMezzo: any[];
    codiceStatoMezzo: any[];
}

export const FiltriComposizioneStateDefaults: FilterbarComposizioneStateModel = {
    filtri: null,
    codiceDistaccamento: [],
    codiceTipoMezzo: [],
    codiceStatoMezzo: []
};

@State<FilterbarComposizioneStateModel>({
    name: 'filterbarComposizione',
    defaults: FiltriComposizioneStateDefaults
})
export class FilterbarComposizioneState {

    @Selector()
    static filtri(state: FilterbarComposizioneStateModel) {
        return state.filtri;
    }

    @Selector()
    static filtriSelezionati(state: FilterbarComposizioneStateModel) {
        return {
            'CodiceDistaccamento': state.codiceDistaccamento,
            'CodiceTipoMezzo': state.codiceTipoMezzo,
            'CodiceStatoMezzo': state.codiceStatoMezzo
        };
    }

    constructor(private filterbar: FilterbarService) {
    }

    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<FilterbarComposizioneStateModel>) {
        this.filterbar.getFiltri().subscribe((filtri: any) => {
            dispatch(new SetFiltriComposizione(filtri));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));

    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ patchState }: StateContext<FilterbarComposizioneStateModel>, action: SetFiltriComposizione) {
        patchState({
            filtri: action.filtri
        });
    }

    @Action(AddFiltroSelezionatoComposizione)
    addFiltroSelezionatoComposizione(ctx: StateContext<FilterbarComposizioneStateModel>, action: AddFiltroSelezionatoComposizione) {
        console.log('Filtro selezionato', action.filtro);
        // const state = ctx.getState();
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: insertItem(action.filtro)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: insertItem(action.filtro)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: insertItem(action.filtro)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltroSelezionatoComposizione)
    removeFiltroSelezionatoComposizione(ctx: StateContext<FilterbarComposizioneStateModel>, action: RemoveFiltroSelezionatoComposizione) {
        console.log('Filtro deselezionato', action.filtro);
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: removeItem(filtro => filtro === action.filtro)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: removeItem(filtro => filtro === action.filtro)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: removeItem(filtro => filtro === action.filtro)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltriSelezionatiComposizione)
    removeFiltriSelezionatiComposizione(ctx: StateContext<FilterbarComposizioneStateModel>, action: RemoveFiltriSelezionatiComposizione) {
        console.log('Filtro deselezionati', action.tipo);
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: []
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: []
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: []
                    })
                );
                break;
        }
    }
}
