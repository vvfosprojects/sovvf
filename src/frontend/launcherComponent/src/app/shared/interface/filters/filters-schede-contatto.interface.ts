import { RangeSchedeContattoEnum } from '../../enum/range-schede-contatto';

export interface FiltersSchedeContattoInterface {
    gestita?: boolean;
    rangeVisualizzazione?: RangeSchedeContattoEnum | number;
}
