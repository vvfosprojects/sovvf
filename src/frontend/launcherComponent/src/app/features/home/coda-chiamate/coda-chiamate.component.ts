import { Component, Input, OnInit } from '@angular/core';
import { ItemChart, ItemChartEmit } from '../../../shared/interface/item-chart.interface';
import { Select, Store } from '@ngxs/store';
import { GetDataGrafico, OpenModalDettaglioDistaccamento } from '../store/actions/coda-chiamate/coda-chiamate.actions';
import { CodaChiamateState } from '../store/states/coda-chiamate/coda-chiamate.state';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-coda-chiamate',
    templateUrl: './coda-chiamate.component.html',
    styleUrls: ['./coda-chiamate.component.scss']
})
export class CodaChiamateComponent implements OnInit {

    @Input() boxAttivi: boolean;

    @Select(CodaChiamateState.dataGrafico) dataGrafico$: Observable<ItemChart[]>;
    @Select(CodaChiamateState.loading) loading$: Observable<boolean>;
    @Select(CodaChiamateState.loadingItemData) loadingItemData$: Observable<boolean>;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(new GetDataGrafico());
    }

    onSelect(data: ItemChartEmit): void {
        this.store.dispatch(new OpenModalDettaglioDistaccamento(data));
    }

    heightCodaChiamate(): string {
        if (this.boxAttivi) {
            return 'm-h-710';
        }
        return 'm-h-840';
    }
}
