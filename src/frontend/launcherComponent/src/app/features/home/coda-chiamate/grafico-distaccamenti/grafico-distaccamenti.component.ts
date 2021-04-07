import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ItemChart, ItemChartEmit } from '../../../../shared/interface/item-chart.interface';

@Component({
    selector: 'app-grafico-distaccamenti',
    templateUrl: './grafico-distaccamenti.component.html',
    styleUrls: ['./grafico-distaccamenti.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraficoDistaccamentiComponent {

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

    @Input() colorScheme: any;
    @Input() schemeType: string;

    @Output() select: EventEmitter<ItemChartEmit> = new EventEmitter<ItemChartEmit>();
    @Output() activate: EventEmitter<ItemChartEmit> = new EventEmitter<ItemChartEmit>();
    @Output() deactivate: EventEmitter<ItemChartEmit> = new EventEmitter<ItemChartEmit>();

    onSelect(data: ItemChartEmit): void {
        this.select.emit(data);
    }

    onActivate(data: ItemChartEmit): void {
        this.activate.emit(data);
    }

    onDeactivate(data: ItemChartEmit): void {
        this.deactivate.emit(data);
    }

}
