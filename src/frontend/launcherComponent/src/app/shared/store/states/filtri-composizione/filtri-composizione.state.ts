import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MezzoComposizione } from '../../../interface/mezzo-composizione-interface';
import { ComposizioneFilterbar } from '../../../../features/home/composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { GetListeComposizioneAvanzata } from '../../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { Composizione } from '../../../enum/composizione.enum';
import { GetListaIdPreAccoppiati } from '../../../../features/home/store/actions/composizione-partenza/composizione-veloce.actions';
import { DescrizioneTipologicaMezzo } from '../../../../features/home/composizione-partenza/interface/filtri/descrizione-filtro-composizione-interface';
import {
    AddFiltroSelezionatoComposizione,
    ClearFiltriAffini,
    GetFiltriComposizione,
    RemoveFiltriSelezionatiComposizione,
    RemoveFiltroSelezionatoComposizione,
    SetFiltriComposizione,
    SetListaFiltriAffini
} from '../../actions/filtri-composizione/filtri-composizione.actions';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { ListaTipologicheMezzi } from '../../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { Injectable } from '@angular/core';

export interface FiltriComposizioneStateStateModel {
    filtriAffini: ListaTipologicheMezzi;
    codiceDistaccamento: any[];
    codiceTipoMezzo: any[];
    codiceStatoMezzo: any[];
}

export const FiltriComposizioneStateDefaults: FiltriComposizioneStateStateModel = {
    filtriAffini: {
        distaccamenti: [],
        generiMezzi: [],
        stati: []
    },
    codiceDistaccamento: [],
    codiceTipoMezzo: [],
    codiceStatoMezzo: [],
};

@Injectable()
@State<FiltriComposizioneStateStateModel>({
    name: 'filtriComposizione',
    defaults: FiltriComposizioneStateDefaults
})
export class FiltriComposizioneState {

    @Selector()
    static filtriAffini(state: FiltriComposizioneStateStateModel): ListaTipologicheMezzi {
        return state.filtriAffini;
    }

    @Selector()
    static filtriSelezionati(state: FiltriComposizioneStateStateModel): ComposizioneFilterbar {
        return {
            CodiceDistaccamento: state.codiceDistaccamento,
            TipoMezzo: state.codiceTipoMezzo,
            StatoMezzo: state.codiceStatoMezzo
        };
    }

    constructor(private store: Store) {
    }


    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<FiltriComposizioneStateStateModel>): void {
        dispatch(new SetFiltriComposizione());
    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ getState, dispatch }: StateContext<FiltriComposizioneStateStateModel>): void {
        const state = getState();
        const composizioneMode = this.store.selectSnapshot(x => x.composizionePartenza.composizioneMode);
        const objFiltriSelezionati: ComposizioneFilterbar = {
            CodiceDistaccamento: state.codiceDistaccamento,
            TipoMezzo: state.codiceTipoMezzo,
            StatoMezzo: state.codiceStatoMezzo
        };
        console.log('SetFiltriComposizione');
        dispatch(new GetListeComposizioneAvanzata(objFiltriSelezionati));
        if (composizioneMode === Composizione.Veloce) {
            dispatch([
                new GetListaIdPreAccoppiati()
            ]);
        }
    }

    @Action(SetListaFiltriAffini)
    setListaFiltriAffini({ patchState }: StateContext<FiltriComposizioneStateStateModel>, action: SetListaFiltriAffini): void {
        const filtri = this.store.selectSnapshot(state => state.tipologicheMezzi.tipologiche);
        const composizioneMezzi = action.composizioneMezzi ? action.composizioneMezzi : this.store.selectSnapshot(x => x.mezziComposizione.allMezziComposizione);
        const filtriDistaccamento = [] as DescrizioneTipologicaMezzo[];
        const filtriStato = [] as DescrizioneTipologicaMezzo[];
        const generiMezzi = [] as DescrizioneTipologicaMezzo[];
        if (composizioneMezzi) {
            if (filtri.distaccamenti) {
                filtri.distaccamenti.forEach((distaccamento: DescrizioneTipologicaMezzo) => {
                    if (checkDistaccamento(distaccamento)) {
                        filtriDistaccamento.push(distaccamento);
                    }
                });
            }
            if (filtri.stati) {
                filtri.stati.forEach((stato: DescrizioneTipologicaMezzo) => {
                    if (checkStato(stato)) {
                        filtriStato.push(stato);
                    }
                });
            }
            if (filtri.generiMezzi) {
                filtri.generiMezzi.forEach((genereMezzi: DescrizioneTipologicaMezzo) => {
                    if (checkGenereMezzo(genereMezzi)) {
                        generiMezzi.push(genereMezzi);
                    }
                });
            }
        }

        function checkDistaccamento(distaccamento: DescrizioneTipologicaMezzo): boolean {
            let check = false;
            composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.distaccamento.codice === distaccamento.id) {
                    check = true;
                }
            });
            return check;
        }

        function checkStato(stato: DescrizioneTipologicaMezzo): boolean {
            let check = false;
            composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.stato === stato.descrizione) {
                    check = true;
                }
            });
            return check;
        }

        function checkGenereMezzo(genereMezzo: DescrizioneTipologicaMezzo): boolean {
            let check = false;
            composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.genere === genereMezzo.descrizione) {
                    check = true;
                }
            });
            return check;
        }

        patchState({
            filtriAffini: {
                distaccamenti: filtriDistaccamento,
                generiMezzi,
                stati: filtriStato
            }
        });
    }

    @Action(ClearFiltriAffini)
    clearFiltriAffini({ patchState }: StateContext<FiltriComposizioneStateStateModel>): void {
        patchState({
            filtriAffini: FiltriComposizioneStateDefaults.filtriAffini
        });
    }

    @Action(AddFiltroSelezionatoComposizione)
    addFiltroSelezionatoComposizione(ctx: StateContext<FiltriComposizioneStateStateModel>, action: AddFiltroSelezionatoComposizione): void {
        console.log('Filtro selezionato => #ID = ' + action.id + ' - TIPO = ' + action.tipo);
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: insertItem(action.id)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: insertItem(action.id)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: insertItem(action.id)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltroSelezionatoComposizione)
    removeFiltroSelezionatoComposizione(ctx: StateContext<FiltriComposizioneStateStateModel>, action: RemoveFiltroSelezionatoComposizione): void {
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltriSelezionatiComposizione)
    removeFiltriSelezionatiComposizione(ctx: StateContext<FiltriComposizioneStateStateModel>, action: RemoveFiltriSelezionatiComposizione): void {
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
