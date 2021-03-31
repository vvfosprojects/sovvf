import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable, NgZone } from '@angular/core';
import { CodaChiamateService } from '../../../../../core/service/coda-chiamate-service/coda-chiamate.service';
import { ItemGraficoCodaChiamate } from '../../../../../shared/interface/item-grafico-coda-chiamate';
import { GetDataGrafico, OpenModalDettaglioDistaccamento, StartLoadingCodaChiamate, StopLoadingCodaChiamate } from '../../actions/coda-chiamate/coda-chiamate.actions';
import { ItemChart } from '../../../../../shared/interface/item-chart.interface';
import { DataGraficoCodaChiamateDto } from '../../../../../shared/interface/dto/data-grafico-coda-chiamate-dto.interface';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DettaglioDistaccamentoModalComponent } from '../../../coda-chiamate/dettaglio-distaccamento-modal/dettaglio-distaccamento-modal.component';
import { DettaglioSedeCodaChiamateDto } from '../../../../../shared/interface/dto/dettaglio-sede-coda-chiamate-dto.interface';

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
            }
            dispatch(new StopLoadingCodaChiamate());
        });
    }

    @Action(OpenModalDettaglioDistaccamento)
    openModalDettaglioDistaccamento({ patchState }: StateContext<CodaChiamateStateModel>, action: OpenModalDettaglioDistaccamento): void {
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
                });
            }
        });
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
