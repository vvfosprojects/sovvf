import { RangeSchedeContattoEnum } from '../../enum/range-schede-contatto';

export interface FiltersSchedeContatto {
    gestita?: boolean;
    rangeVisualizzazione?: RangeSchedeContattoEnum | number;
}
