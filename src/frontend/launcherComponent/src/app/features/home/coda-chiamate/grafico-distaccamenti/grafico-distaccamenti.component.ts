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
    @Input() view: any;
    @Input() loadingItemData: boolean;

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
    @Input() maxYAxisTickLength: number;
    @Input() trimXAxisTicks: boolean;
    @Input() roundDomains: boolean;
    @Input() barPadding: number;
    @Input() groupPadding: number;
    @Input() showGridLines: boolean;
    @Input() showDataLabel: boolean;
    @Input() noBarWhenZero: boolean;
    @Input() roundEdges: boolean;

    @Input() colorScheme: any;
    @Input() schemeType: string;

    @Output() selectChartItem: EventEmitter<ItemChartEmit> = new EventEmitter<ItemChartEmit>();
    @Output() activate: EventEmitter<ItemChartEmit> = new EventEmitter<ItemChartEmit>();
    @Output() deactivate: EventEmitter<ItemChartEmit> = new EventEmitter<ItemChartEmit>();

    onSelect(data: ItemChartEmit): void {
        if (!this.loadingItemData) {
            this.selectChartItem.emit(data);
        }
    }

    onActivate(data: ItemChartEmit): void {
        this.activate.emit(data);
    }

    onDeactivate(data: ItemChartEmit): void {
        this.deactivate.emit(data);
    }

    formatXAxisTick(value: number): any {
        const valueString = '' + value;
        const isDecimal = valueString.indexOf('.') > 0;
        if (!isDecimal) {
            return value;
        }
        return '';
    }

    formatDataLabel(value): string {
        if (value > 0) {
            return value;
        }
        return '';
    }

}
