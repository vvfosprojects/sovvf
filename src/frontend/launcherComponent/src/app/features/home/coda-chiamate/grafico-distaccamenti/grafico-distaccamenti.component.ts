import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemChart } from '../../../../shared/interface/item-chart.interface';

@Component({
    selector: 'app-grafico-distaccamenti',
    templateUrl: './grafico-distaccamenti.component.html',
    styleUrls: ['./grafico-distaccamenti.component.scss']
})
export class GraficoDistaccamentiComponent implements OnInit {

    @Input() data: ItemChart[];

    @Input() view: number[];

    // options
    @Input() showXAxis: boolean;
    @Input() showYAxis: boolean;
    @Input() gradient: boolean;
    @Input() showLegend: boolean;
    @Input() legendTitle: string;
    @Input() legendPosition: string;
    @Input() showXAxisLabel: boolean;
    @Input() yAxisLabel: string;
    @Input() showYAxisLabel: boolean;
    @Input() xAxisLabel: string;

    @Input() colorScheme: any; // TODO: tipizzare
    @Input() schemeType: string;

    @Output() select: EventEmitter<ItemChart> = new EventEmitter<ItemChart>();
    @Output() activate: EventEmitter<ItemChart> = new EventEmitter<ItemChart>();
    @Output() deactivate: EventEmitter<ItemChart> = new EventEmitter<ItemChart>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onSelect(data: ItemChart): void {
        this.select.emit(data);
    }

    onActivate(data: ItemChart): void {
        this.activate.emit(data);
    }

    onDeactivate(data: ItemChart): void {
        this.deactivate.emit(data);
    }

}
