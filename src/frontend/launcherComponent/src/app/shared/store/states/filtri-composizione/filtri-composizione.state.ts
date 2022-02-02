import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ComposizioneFilterbar } from '../../../../features/home/composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { Composizione } from '../../../enum/composizione.enum';
import {
    AddFiltroSelezionatoComposizione,
    GetFiltriComposizione,
    ResetFiltriComposizione,
    RemoveFiltroSelezionatoComposizione,
    SetFiltriComposizione,
    ClearFiltriComposizione,
    SetFiltriDistaccamentoDefault,
    SetFiltriGeneriMezzoTriage
} from '../../actions/filtri-composizione/filtri-composizione.actions';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { ListaTipologicheMezzi } from '../../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { Injectable } from '@angular/core';
import { ComposizionePartenzaState } from '../../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { GetListaComposizioneVeloce } from '../../../../features/home/store/actions/composizione-partenza/composizione-veloce.actions';
import { TipologicaComposizionePartenza } from '../../../../features/home/composizione-partenza/interface/filtri/tipologica-composizione-partenza.interface';
import { makeCopy } from '../../../helper/function-generiche';
import { FiltroTurnoSquadre } from '../../../enum/filtro-turno-composizione-partenza.enum';

export interface FiltriComposizioneStateStateModel {
    filtri: ListaTipologicheMezzi;
    turno: number;
    codiceDistaccamento: any[];
    tipoMezzo: any[];
    statoMezzo: any[];
}

export const FiltriComposizioneStateDefaults: FiltriComposizioneStateStateModel = {
    filtri: {
        turni: null,
        distaccamenti: [],
        generiMezzi: [],
        stati: []
    },
    turno: null,
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
            Turno: state.turno,
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

    @Action(SetFiltriDistaccamentoDefault)
    setFiltriDistaccamentoDefault({ patchState }: StateContext<FiltriComposizioneStateStateModel>, action: SetFiltriDistaccamentoDefault): void {
        patchState({
            codiceDistaccamento: action.distaccamenti
        });
    }

    @Action(SetFiltriGeneriMezzoTriage)
    setFiltriGeneriMezzoTriage({ patchState }: StateContext<FiltriComposizioneStateStateModel>, action: SetFiltriGeneriMezzoTriage): void {
        console.log('SetFiltriGeneriMezzoTriage', action.generiMezzo);
        patchState({
            tipoMezzo: action.generiMezzo
        });
    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ patchState, dispatch }: StateContext<FiltriComposizioneStateStateModel>): void {
        const composizioneMode = this.store.selectSnapshot(x => x.composizionePartenza.composizioneMode);
        if (composizioneMode === Composizione.Avanzata && this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione)) {
            // Lista loadata in filterbar-composizione per distaccamenti di competenza default.
            // dispatch(new GetListeComposizioneAvanzata());
        }
        if (composizioneMode === Composizione.Veloce) {
            dispatch(new GetListaComposizioneVeloce());
        }
        const filtri = makeCopy(this.store.selectSnapshot(state => state.tipologicheMezzi.tipologiche));
        if (filtri) {
            filtri.distaccamenti = filtri.distaccamenti.map((d: TipologicaComposizionePartenza) => {
                d.descDistaccamento = d.descDistaccamento.replace('Distaccamento di ', '');
                d.descDistaccamento = d.descDistaccamento.replace('Distaccamento ', '');
                return d;
            });
            filtri.turni = [FiltroTurnoSquadre[0], FiltroTurnoSquadre[1]];
        }
        patchState({
            filtri
        });
    }

    @Action(AddFiltroSelezionatoComposizione)
    addFiltroSelezionatoComposizione(ctx: StateContext<FiltriComposizioneStateStateModel>, action: AddFiltroSelezionatoComposizione): void {
        console.log('Filtro selezionato => #ID = ' + action.id + ' - TIPO = ' + action.tipoFiltro);
        switch (action.tipoFiltro) {
            case 'turno':
                ctx.setState(
                    patch({
                        turno: FiltroTurnoSquadre[action.id]
                    })
                );
                break;
            case 'codiceDistaccamento':
                const codiciDistaccamento = [];
                const copyCodici = makeCopy(action.id);
                copyCodici.forEach(x => codiciDistaccamento.push(x.id));
                ctx.patchState({
                    codiceDistaccamento: codiciDistaccamento
                });
                break;
            case 'tipoMezzo':
                const tipoMezzo = [];
                const copyTipoMezzo = makeCopy(action.id);
                copyTipoMezzo.forEach(x => tipoMezzo.push(x.descrizione));
                ctx.patchState({
                    tipoMezzo,
                });
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
            case 'turno':
                ctx.setState(
                    patch({
                        turno: FiltriComposizioneStateDefaults.turno
                    })
                );
                break;
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: FiltriComposizioneStateDefaults.codiceDistaccamento
                    })
                );
                break;
            case 'tipoMezzo':
                ctx.setState(
                    patch({
                        tipoMezzo: FiltriComposizioneStateDefaults.tipoMezzo
                    })
                );
                break;
            case 'statoMezzo':
                ctx.setState(
                    patch({
                        statoMezzo: FiltriComposizioneStateDefaults.statoMezzo
                    })
                );
                break;
        }
    }

    @Action(ClearFiltriComposizione)
    clearFiltriComposizione(ctx: StateContext<FiltriComposizioneStateStateModel>): void {
        ctx.setState(
            patch({
                    turno: FiltriComposizioneStateDefaults.turno,
                    codiceDistaccamento: FiltriComposizioneStateDefaults.codiceDistaccamento,
                    tipoMezzo: FiltriComposizioneStateDefaults.tipoMezzo,
                    statoMezzo: FiltriComposizioneStateDefaults.statoMezzo
                }
            )
        );
    }
}
