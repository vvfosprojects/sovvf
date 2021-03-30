export interface ItemChart {
    name: string;
    series: SeriesItemChart[];
}

interface SeriesItemChart {
    name: string;
    value: number;
    extra: ExtraSeriesItemChart;
}

interface ExtraSeriesItemChart {
    code: string;
}
