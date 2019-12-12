import { RangeSchedeContattoEnum } from '../enum/range-schede-contatto';

export interface FiltriSchedeContatto {
  testoLibero: string;
  gestita: boolean;
  rangeVisualizzazione: RangeSchedeContattoEnum | number;
}
