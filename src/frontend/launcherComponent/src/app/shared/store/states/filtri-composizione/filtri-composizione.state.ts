import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ComposizioneFilterbar } from '../../../../features/home/composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { GetListeComposizioneAvanzata } from '../../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { Composizione } from '../../../enum/composizione.enum';
import {
    AddFiltroSelezionatoComposizione,
    GetFiltriComposizione,
    ResetFiltriComposizione,
    RemoveFiltroSelezionatoComposizione,
    SetFiltriComposizione
} from '../../actions/filtri-composizione/filtri-composizione.actions';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { ListaTipologicheMezzi } from '../../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { Injectable } from '@angular/core';
import {ComposizionePartenzaState} from '../../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { GetListaComposizioneVeloce } from '../../../../features/home/store/actions/composizione-partenza/composizione-veloce.actions';

export interface FiltriComposizioneStateStateModel {
    filtri: ListaTipologicheMezzi;
    codiceDistaccamento: any[];
    tipoMezzo: any[];
    statoMezzo: any[];
}

export const FiltriComposizioneStateDefaults: FiltriComposizioneStateStateModel = {
    filtri: {
        distaccamenti: [],
        generiMezzi: [],
        stati: []
    },
    codiceDistaccamento: [],
    tipoMezzo: [],
    statoMezzo: [],
};

@Injectable()
@State<FiltriComposizioneStateStateModel>({
    name: 'filtriComposizione',
    defaults: FiltriComposizioneStateDefaults
})
export class FiltriComposizioneState {

    @Selector()
    static filtri(state: FiltriComposizioneStateStateModel): ListaTipologicheMezzi {
        return state.filtri;
    }

    @Selector()
    static filtriSelezionati(state: FiltriComposizioneStateStateModel): ComposizioneFilterbar {
        return {
            CodiceDistaccamento: state.codiceDistaccamento,
            TipoMezzo: state.tipoMezzo,
            StatoMezzo: state.statoMezzo
        };
    }

    constructor(private store: Store) {
    }


    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<FiltriComposizioneStateStateModel>): void {
        dispatch(new SetFiltriComposizione());
    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ patchState, dispatch }: StateContext<FiltriComposizioneStateStateModel>): void {
        const composizioneMode = this.store.selectSnapshot(x => x.composizionePartenza.composizioneMode);
        if (composizioneMode === Composizione.Avanzata &&  this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione)) {
            dispatch(new GetListeComposizioneAvanzata());
        }
        if (composizioneMode === Composizione.Veloce) {
            dispatch(new GetListaComposizioneVeloce());
        }
        const filtri = this.store.selectSnapshot(state => state.tipologicheMezzi.tipologiche);
        patchState({ filtri });
    }

    @Action(AddFiltroSelezionatoComposizione)
    addFiltroSelezionatoComposizione(ctx: StateContext<FiltriComposizioneStateStateModel>, action: AddFiltroSelezionatoComposizione): void {
        console.log('Filtro selezionato => #ID = ' + action.id + ' - TIPO = ' + action.tipoFiltro);
        switch (action.tipoFiltro) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: removeItem(codiceDistaccamento => codiceDistaccamento !== action.id)
                    })
                );
                ctx.setState(
                    patch({
                        codiceDistaccamento: insertItem(action.id)
                    })
                );
                break;
            case 'tipoMezzo':
                ctx.setState(
                    patch({
                        tipoMezzo: removeItem(tipoMezzo => tipoMezzo !== action.id)
                    })
                );
                ctx.setState(
                    patch({
                        tipoMezzo: insertItem(action.id)
                    })
                );
                break;
            case 'statoMezzo':
                ctx.setState(
                    patch({
                        statoMezzo: removeItem(statoMezzo => statoMezzo !== action.id)
                    })
                );
                ctx.setState(
                    patch({
                        statoMezzo: insertItem(action.id)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltroSelezionatoComposizione)
    removeFiltroSelezionatoComposizione(ctx: StateContext<FiltriComposizioneStateStateModel>, action: RemoveFiltroSelezionatoComposizione): void {
        switch (action.tipoFiltro) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
            case 'tipoMezzo':
                ctx.setState(
                    patch({
                        tipoMezzo: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
            case 'statoMezzo':
                ctx.setState(
                    patch({
                        statoMezzo: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
        }
    }

    @Action(ResetFiltriComposizione)
    resetFiltriComposizione(ctx: StateContext<FiltriComposizioneStateStateModel>, action: ResetFiltriComposizione): void {
        switch (action.tipoFiltro) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: []
                    })
                );
                break;
            case 'tipoMezzo':
                ctx.setState(
                    patch({
                        tipoMezzo: []
                    })
                );
                break;
            case 'statoMezzo':
                ctx.setState(
                    patch({
                        statoMezzo: []
                    })
                );
                break;
        }
    }
}
