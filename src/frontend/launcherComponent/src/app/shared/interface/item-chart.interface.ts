export interface ItemChart {
    name: string;
    series: SeriesItemChart[];
}

export interface ItemChartEmit {
    extra: ExtraSeriesItemChart;
    label: string;
    name: string;
    series: string;
    value: number;
}

interface SeriesItemChart {
    name: string;
    value: number;
    extra: ExtraSeriesItemChart;
}

interface ExtraSeriesItemChart {
    code: string;
}
