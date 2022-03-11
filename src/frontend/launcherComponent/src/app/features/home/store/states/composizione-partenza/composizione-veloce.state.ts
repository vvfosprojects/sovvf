import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    ClearComposizioneVeloce,
    ClearPreaccoppiati,
    ClearPreAccoppiatiSelezionatiComposizione,
    GetListaComposizioneVeloce,
    HoverInPreAccoppiatoComposizione,
    HoverOutPreAccoppiatoComposizione,
    SelectPreAccoppiatoComposizione,
    SetIdPreAccoppiatiOccupati,
    SetListaPreaccoppiati,
    UnselectPreAccoppiatoComposizione,
    UpdateMezzoPreAccoppiatoComposizione
} from '../../actions/composizione-partenza/composizione-veloce.actions';
import { BoxPartenza, BoxPartenzaPreAccoppiati } from '../../../composizione-partenza/interface/box-partenza-interface';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import { checkSquadraOccupata, mezzoComposizioneBusy } from '../../../../../shared/helper/function-composizione';
import { Injectable } from '@angular/core';
import { PaginationComposizionePartenzaState } from '../../../../../shared/store/states/pagination-composizione-partenza/pagination-composizione-partenza.state';
import { ComposizionePartenzaState } from './composizione-partenza.state';
import { FiltriComposizioneState } from '../../../../../shared/store/states/filtri-composizione/filtri-composizione.state';
import { ListaComposizioneVeloce } from '../../../../../shared/interface/lista-composizione-veloce-interface';
import { AddConcorrenza, DeleteConcorrenza } from '../../../../../shared/store/actions/concorrenza/concorrenza.actions';
import { TipoConcorrenzaEnum } from '../../../../../shared/enum/tipo-concorrenza.enum';
import { SquadraComposizione } from '../../../../../shared/interface/squadra-composizione-interface';
import { StartPreaccoppiatiComposizioneLoading, StopPreaccoppiatiComposizioneLoading } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { AddConcorrenzaDtoInterface } from '../../../../../shared/interface/dto/concorrenza/add-concorrenza-dto.interface';

export interface ComposizioneVeloceStateModel {
    allPreAccoppiati: BoxPartenzaPreAccoppiati[];
    preAccoppiati: BoxPartenzaPreAccoppiati[];
    idPreAccoppiatoSelezionato: string;
    idPreAccoppiatiSelezionati: string[];
    idPreAccoppiatiOccupati: string[];
    idPreaccoppiatoHover: string;
}

export const ComposizioneVeloceStateDefaults: ComposizioneVeloceStateModel = {
    allPreAccoppiati: null,
    preAccoppiati: null,
    idPreAccoppiatoSelezionato: null,
    idPreAccoppiatiSelezionati: [],
    idPreAccoppiatiOccupati: [],
    idPreaccoppiatoHover: null
};

@Injectable()
@State<ComposizioneVeloceStateModel>({
    name: 'composizioneVeloce',
    defaults: ComposizioneVeloceStateDefaults
})
export class ComposizioneVeloceState {

    @Selector()
    static preAccoppiati(state: ComposizioneVeloceStateModel): BoxPartenzaPreAccoppiati[] {
        return state.preAccoppiati;
    }

    @Selector()
    static idPreAccoppiatiSelezionati(state: ComposizioneVeloceStateModel): string[] {
        return state.idPreAccoppiatiSelezionati;
    }

    @Selector()
    static idPreAccoppiatiOccupati(state: ComposizioneVeloceStateModel): string[] {
        return state.idPreAccoppiatiOccupati;
    }

    @Selector()
    static idPreAccoppiatoSelezionato(state: ComposizioneVeloceStateModel): string {
        return state.idPreAccoppiatoSelezionato;
    }

    @Selector()
    static idPreAccoppiatoHover(state: ComposizioneVeloceStateModel): string {
        return state.idPreaccoppiatoHover;
    }

    constructor(private compPartenzaService: CompPartenzaService,
                private store: Store) {
    }

    @Action(GetListaComposizioneVeloce)
    getListaPreAccoppiati({ dispatch }: StateContext<ComposizioneVeloceStateModel>, action: GetListaComposizioneVeloce): void {
        const paginationPreaccoppiati = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationMezzi);
        const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        const filtriSelezionati = this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati);
        const obj = {
            idRichiesta: richiestaComposizione ? richiestaComposizione.id : null,
            pagination: {
                page: action.options && action.options.page && action.options.page ? action.options.page : paginationPreaccoppiati.page,
                pageSize: paginationPreaccoppiati.pageSize
            },
            turno: filtriSelezionati.Turno !== null ? '' + filtriSelezionati.Turno : null,
            codiceDistaccamento: filtriSelezionati.CodiceDistaccamento.length > 0 ? filtriSelezionati.CodiceDistaccamento : null,
            statoMezzo: filtriSelezionati.StatoMezzo.length > 0 ? filtriSelezionati.StatoMezzo : null,
            tipoMezzo: filtriSelezionati.TipoMezzo?.length > 0 ? filtriSelezionati.TipoMezzo : null,
        } as any;
        dispatch(new StartPreaccoppiatiComposizioneLoading());
        this.compPartenzaService.getListaComposizioneVeloce(obj).subscribe((response: ListaComposizioneVeloce) => {
            const preaccoppiatiOccupati = [];
            response.dataArray.forEach((preaccoppiato: BoxPartenzaPreAccoppiati) => {
                if (mezzoComposizioneBusy(preaccoppiato.statoMezzo) || checkSquadraOccupata(preaccoppiato.squadre)) {
                    preaccoppiatiOccupati.push(preaccoppiato.id);
                }
            });
            dispatch([
                new SetListaPreaccoppiati(response.dataArray),
                new SetIdPreAccoppiatiOccupati(preaccoppiatiOccupati),
                new StopPreaccoppiatiComposizioneLoading()
            ]);
        }, () => dispatch(new StopPreaccoppiatiComposizioneLoading()));
    }

    @Action(SetListaPreaccoppiati)
    setListaPreaccoppiati({ patchState }: StateContext<ComposizioneVeloceStateModel>, action: SetListaPreaccoppiati): void {
        if (action.preAccoppiati) {
            patchState({
                preAccoppiati: action.preAccoppiati,
                allPreAccoppiati: action.preAccoppiati
            });
        }
    }

    @Action(ClearPreaccoppiati)
    clearPreaccoppiati({ patchState }: StateContext<ComposizioneVeloceStateModel>): void {
        patchState({
            preAccoppiati: null,
            allPreAccoppiati: null
        });
    }

    @Action(SelectPreAccoppiatoComposizione)
    selectPreAccoppiatoComposizione({ setState, dispatch }: StateContext<ComposizioneVeloceStateModel>, action: SelectPreAccoppiatoComposizione): void {
        const preAccoppiato = action.preAcc;
        if (preAccoppiato) {
            const dataSquadraList = [] as AddConcorrenzaDtoInterface[];
            preAccoppiato.squadre.forEach((sC: SquadraComposizione) => {
                console.log('select squadra preaccoppiato', sC.codice);
                const dataSquadra = {
                    type: TipoConcorrenzaEnum.Squadra,
                    value: sC.codice
                } as AddConcorrenzaDtoInterface;
                dataSquadraList.push(dataSquadra);
            });
            dispatch(new AddConcorrenza(dataSquadraList));
            console.log('select mezzo preaccoppiato', preAccoppiato.codiceMezzo);
            const dataMezzo = {
                type: TipoConcorrenzaEnum.Mezzo,
                value: preAccoppiato.codiceMezzo
            } as AddConcorrenzaDtoInterface;
            dispatch(new AddConcorrenza([dataMezzo]));

            setState(
                patch({
                    idPreAccoppiatiSelezionati: insertItem(preAccoppiato.id),
                    idPreAccoppiatoSelezionato: preAccoppiato.id
                })
            );
        }
    }

    @Action(UnselectPreAccoppiatoComposizione)
    unselectPreAccoppiatoComposizione({ setState, dispatch }: StateContext<ComposizioneVeloceStateModel>, action: UnselectPreAccoppiatoComposizione): void {
        const preAccoppiato = action.preAcc;
        if (preAccoppiato) {
            const codiciSquadre = preAccoppiato.squadre.map((sC: SquadraComposizione) => sC.codice);
            dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Squadra, codiciSquadre));
            console.log('remove mezzo preaccoppiato', preAccoppiato.codiceMezzo);
            dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Mezzo, [preAccoppiato.codiceMezzo]));

            setState(
                patch({
                    idPreAccoppiatiSelezionati: removeItem(x => x === action.preAcc.id),
                    idPreAccoppiatoSelezionato: null
                })
            );
        }
    }

    @Action(ClearPreAccoppiatiSelezionatiComposizione)
    clearPreAccoppiatiSelezionatiComposizione({ patchState }: StateContext<ComposizioneVeloceStateModel>): void {
        patchState({
                idPreAccoppiatiSelezionati: ComposizioneVeloceStateDefaults.idPreAccoppiatiSelezionati,
                idPreAccoppiatoSelezionato: ComposizioneVeloceStateDefaults.idPreAccoppiatoSelezionato
            }
        );
    }

    @Action(UpdateMezzoPreAccoppiatoComposizione)
    updateMezzoBoxPartenzaComposizione({ getState, setState }: StateContext<ComposizioneVeloceStateModel>, action: UpdateMezzoPreAccoppiatoComposizione): void {
        const state = getState();
        let preAccoppiato = null;
        state.preAccoppiati.forEach((preAcc: BoxPartenzaPreAccoppiati) => {
            if (preAcc.codiceMezzo === action.codiceMezzo) {
                preAccoppiato = makeCopy(preAcc);
                preAccoppiato.mezzoComposizione = action.codiceMezzo;
            }
        });
        setState(
            patch({
                preAccoppiati: updateItem((preAcc: BoxPartenza) => preAcc.mezzoComposizione.mezzo.codice === action.codiceMezzo, preAccoppiato)
            })
        );
    }

    @Action(ClearComposizioneVeloce)
    clearComposizioneVeloce({ patchState }: StateContext<ComposizioneVeloceStateModel>): void {
        patchState(ComposizioneVeloceStateDefaults);
    }

    @Action(SetIdPreAccoppiatiOccupati)
    setIdPreAccoppiatiOccupati({ patchState }: StateContext<ComposizioneVeloceStateModel>, action: SetIdPreAccoppiatiOccupati): void {
        if (action && action.idPreaccoppiatiOccupati) {
            patchState({
                idPreAccoppiatiOccupati: action.idPreaccoppiatiOccupati
            });
        }
    }

    @Action(HoverInPreAccoppiatoComposizione)
    hoverInPreAccoppiatoComposizione({ patchState, dispatch }: StateContext<ComposizioneVeloceStateModel>, action: HoverInPreAccoppiatoComposizione): void {
        patchState({
            idPreaccoppiatoHover: action.idBoxPartenzaHover.idBoxPartenza
        });
    }

    @Action(HoverOutPreAccoppiatoComposizione)
    hoverOutPreAccoppiatoComposizione({ patchState }: StateContext<ComposizioneVeloceStateModel>): void {
        patchState({
            idPreaccoppiatoHover: null
        });
    }
}
