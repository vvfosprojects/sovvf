import { Component, OnInit } from '@angular/core';
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

    @Select(CodaChiamateState.dataGrafico) dataGrafico$: Observable<ItemChart[]>;
    @Select(CodaChiamateState.valoreMassimo) valoreMassimo$: Observable<number>;
    @Select(CodaChiamateState.loading) loading$: Observable<boolean>;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(new GetDataGrafico());
    }

    onSelect(data: ItemChartEmit): void {
        this.store.dispatch(new OpenModalDettaglioDistaccamento(data));
        // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data: ItemChartEmit): void {
        // console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data: ItemChartEmit): void {
        // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
}
