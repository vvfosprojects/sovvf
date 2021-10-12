import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable, NgZone } from '@angular/core';
import { CodaChiamateService } from '../../../../../core/service/coda-chiamate-service/coda-chiamate.service';
import { ItemGraficoCodaChiamate } from '../../../../../shared/interface/item-grafico-coda-chiamate';
import {
    AddChiamateDistaccamentoCodaChiamate,
    AddSquadreLibereDistaccamentoCodaChiamate,
    AddSquadreOccupateDistaccamentoCodaChiamate,
    SortDataGrafico,
    GetDataGrafico,
    OpenModalDettaglioDistaccamento,
    RemoveChiamateDistaccamentoCodaChiamate,
    RemoveSquadreLibereDistaccamentoCodaChiamate,
    RemoveSquadreOccupateDistaccamentoCodaChiamate,
    StartLoadingCodaChiamate,
    StopLoadingCodaChiamate
} from '../../actions/coda-chiamate/coda-chiamate.actions';
import { ItemChart } from '../../../../../shared/interface/item-chart.interface';
import { DataGraficoCodaChiamateDto } from '../../../../../shared/interface/dto/coda-chiamate/data-grafico-coda-chiamate-dto.interface';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DettaglioDistaccamentoModalComponent } from '../../../coda-chiamate/dettaglio-distaccamento-modal/dettaglio-distaccamento-modal.component';
import { DettaglioSedeCodaChiamateDto } from '../../../../../shared/interface/dto/coda-chiamate/dettaglio-sede-coda-chiamate-dto.interface';
import { SetRichiestaComposizione } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ToggleComposizione } from '../../actions/view/view.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import produce from 'immer';

export interface CodaChiamateStateModel {
    data: ItemGraficoCodaChiamate[];
    loading: boolean;
}

export const CodaChiamateStateDefaults: CodaChiamateStateModel = {
    data: undefined,
    loading: undefined
};

@Injectable()
@State<CodaChiamateStateModel>({
    name: 'codaChiamate',
    defaults: CodaChiamateStateDefaults
})
export class CodaChiamateState {

    @Selector()
    static dataGrafico(state: CodaChiamateStateModel): ItemChart[] {
        return state.data.map((value: ItemGraficoCodaChiamate) => ({
            name: value.descDistaccamento,
            series: [
                {
                    name: 'Richieste',
                    value: value.numRichieste,
                    extra: {
                        code: value.codDistaccamento
                    }
                },
                {
                    name: 'Squadre Libere',
                    value: value.squadreLibere,
                    extra: {
                        code: value.codDistaccamento
                    }
                },
                {
                    name: 'Squadre Occupate',
                    value: value.squadreOccupate,
                    extra: {
                        code: value.codDistaccamento
                    }
                }
            ]
        }));
    }

    @Selector()
    static loading(state: CodaChiamateStateModel): boolean {
        return state.loading;
    }

    constructor(private codaChiamateService: CodaChiamateService,
                private ngZone: NgZone,
                private modalService: NgbModal) {
    }

    @Action(GetDataGrafico)
    getDataGrafico({ patchState, dispatch }: StateContext<CodaChiamateStateModel>): void {
        dispatch(new StartLoadingCodaChiamate());
        this.codaChiamateService.getDataGrafico().subscribe((response: DataGraficoCodaChiamateDto) => {
            if (response?.infoIstogramma) {
                patchState({
                        data: response.infoIstogramma
                    }
                );
                dispatch(new SortDataGrafico());
            }
            dispatch(new StopLoadingCodaChiamate());
        });
    }

    @Action(SortDataGrafico)
    sortDataGrafico({ getState, patchState }: StateContext<CodaChiamateStateModel>): void {
        const state = getState();
        const dataGrafico = makeCopy(state.data);

        patchState({
            data: dataGrafico.sort(sortType)
        });

        function sortType(a, b): number {
            if (a.numRichieste < b.numRichieste) {
                return 1;
            }
            if (a.numRichieste > b.numRichieste) {
                return -1;
            }
            return 0;
        }
    }

    @Action(OpenModalDettaglioDistaccamento)
    openModalDettaglioDistaccamento({ patchState, dispatch }: StateContext<CodaChiamateStateModel>, action: OpenModalDettaglioDistaccamento): void {
        const codSede = action.item.extra.code;
        this.codaChiamateService.getDettaglioSede(codSede).subscribe((response: DettaglioSedeCodaChiamateDto) => {
            if (response?.infoDistaccamento) {
                const modalOptions = {
                    windowClass: 'modal-holder xxlModal',
                    centered: true,
                } as NgbModalOptions;

                this.ngZone.run(() => {
                    const modal = this.modalService.open(DettaglioDistaccamentoModalComponent, modalOptions);
                    modal.componentInstance.codDistaccamento = response.infoDistaccamento.codDistaccamento;
                    modal.componentInstance.descDistaccamento = response.infoDistaccamento.descDistaccamento;
                    modal.componentInstance.richieste = response.infoDistaccamento.listaSintesi;
                    modal.componentInstance.squadre = response.infoDistaccamento.listaSquadre;

                    modal.result.then((result: { status: string, data: SintesiRichiesta }) => {
                        switch (result.status) {
                            case 'nuovaPartenza':
                                const richiesta = result.data;
                                dispatch([
                                    new SetRichiestaComposizione(richiesta),
                                    new ToggleComposizione(Composizione.Avanzata)
                                ]);
                                break;
                            case 'ko':
                                break;
                            default:
                                break;
                        }
                    });
                });
            }
        });
    }

    @Action(AddChiamateDistaccamentoCodaChiamate)
    addChiamateDistaccamentoCodaChiamate({ getState, setState, dispatch }: StateContext<CodaChiamateStateModel>, action: AddChiamateDistaccamentoCodaChiamate): void {
        const state = getState();
        const dataGrafico = state.data;
        const codDistaccamento = action.changes.codDistaccamento;
        if (dataGrafico) {
            setState(
                produce(state, (draft: CodaChiamateStateModel) => {
                    const dataGraficoFiltered = draft.data.filter((i: ItemGraficoCodaChiamate) => i.codDistaccamento === codDistaccamento)[0];
                    if (dataGraficoFiltered) {
                        dataGraficoFiltered.numRichieste += action.changes.count;
                    }
                })
            );
            dispatch(new SortDataGrafico());
        }
    }

    @Action(AddSquadreLibereDistaccamentoCodaChiamate)
    addSquadreLibereDistaccamentoCodaChiamate({ getState, setState, dispatch }: StateContext<CodaChiamateStateModel>, action: AddSquadreLibereDistaccamentoCodaChiamate): void {
        const state = getState();
        const dataGrafico = state.data;
        const codDistaccamento = action.changes.codDistaccamento;
        if (dataGrafico) {
            setState(
                produce(state, (draft: CodaChiamateStateModel) => {
                    const dataGraficoFiltered = draft.data.filter((i: ItemGraficoCodaChiamate) => i.codDistaccamento === codDistaccamento)[0];
                    if (dataGraficoFiltered) {
                        dataGraficoFiltered.squadreLibere += action.changes.count;
                    }
                })
            );
            dispatch(new SortDataGrafico());
        }
    }

    @Action(AddSquadreOccupateDistaccamentoCodaChiamate)
    addSquadreOccupateDistaccamentoCodaChiamate({ getState, setState, dispatch }: StateContext<CodaChiamateStateModel>, action: AddSquadreOccupateDistaccamentoCodaChiamate): void {
        const state = getState();
        const dataGrafico = state.data;
        const codDistaccamento = action.changes.codDistaccamento;
        if (dataGrafico) {
            setState(
                produce(state, (draft: CodaChiamateStateModel) => {
                    const dataGraficoFiltered = draft.data.filter((i: ItemGraficoCodaChiamate) => i.codDistaccamento === codDistaccamento)[0];
                    if (dataGraficoFiltered) {
                        dataGraficoFiltered.squadreOccupate += action.changes.count;
                    }
                })
            );
            dispatch(new SortDataGrafico());
        }
    }

    @Action(RemoveChiamateDistaccamentoCodaChiamate)
    removeChiamateDistaccamentoCodaChiamate({ getState, setState, dispatch }: StateContext<CodaChiamateStateModel>, action: RemoveChiamateDistaccamentoCodaChiamate): void {
        const state = getState();
        const dataGrafico = state.data;
        const codDistaccamento = action.changes.codDistaccamento;
        if (dataGrafico) {
            setState(
                produce(state, (draft: CodaChiamateStateModel) => {
                    const dataGraficoFiltered = draft.data.filter((i: ItemGraficoCodaChiamate) => i.codDistaccamento === codDistaccamento)[0];
                    if (dataGraficoFiltered && dataGraficoFiltered?.numRichieste > 0) {
                        dataGraficoFiltered.numRichieste -= action.changes.count;
                    }
                })
            );
            dispatch(new SortDataGrafico());
        }
    }

    @Action(RemoveSquadreLibereDistaccamentoCodaChiamate)
    removeSquadreLibereDistaccamentoCodaChiamate({ getState, setState, dispatch }: StateContext<CodaChiamateStateModel>, action: RemoveSquadreLibereDistaccamentoCodaChiamate): void {
        const state = getState();
        const dataGrafico = state.data;
        const codDistaccamento = action.changes.codDistaccamento;
        if (dataGrafico) {
            setState(
                produce(state, (draft: CodaChiamateStateModel) => {
                    const dataGraficoFiltered = draft.data.filter((i: ItemGraficoCodaChiamate) => i.codDistaccamento === codDistaccamento)[0];
                    if (dataGraficoFiltered && dataGraficoFiltered?.squadreLibere > 0) {
                        dataGraficoFiltered.squadreLibere -= action.changes.count;
                    }
                })
            );
            dispatch(new SortDataGrafico());
        }
    }

    @Action(RemoveSquadreOccupateDistaccamentoCodaChiamate)
    removeSquadreOccupateDistaccamentoCodaChiamate({ getState, setState, dispatch }: StateContext<CodaChiamateStateModel>, action: AddSquadreOccupateDistaccamentoCodaChiamate): void {
        const state = getState();
        const dataGrafico = state.data;
        const codDistaccamento = action.changes.codDistaccamento;
        if (dataGrafico) {
            setState(
                produce(state, (draft: CodaChiamateStateModel) => {
                    const dataGraficoFiltered = draft.data.filter((i: ItemGraficoCodaChiamate) => i.codDistaccamento === codDistaccamento)[0];
                    if (dataGraficoFiltered && dataGraficoFiltered?.squadreOccupate > 0) {
                        dataGraficoFiltered.squadreOccupate -= action.changes.count;
                    }
                })
            );
            dispatch(new SortDataGrafico());
        }
    }

    @Action(StartLoadingCodaChiamate)
    startLoadingCodaChiamate({ patchState }: StateContext<CodaChiamateStateModel>): void {
        patchState({
                loading: true
            }
        );
    }

    @Action(StopLoadingCodaChiamate)
    stopLoadingCodaChiamate({ patchState }: StateContext<CodaChiamateStateModel>): void {
        patchState({
                loading: false
            }
        );
    }
}
