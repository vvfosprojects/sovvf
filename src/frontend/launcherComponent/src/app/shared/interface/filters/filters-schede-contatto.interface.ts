import { RangeSchedeContattoEnum } from '../../enum/range-schede-contatto';

export interface FiltersSchedeContattoInterface {
    gestita?: boolean;
    recenti?: string;
    rangeVisualizzazione?: RangeSchedeContattoEnum | number;
}
