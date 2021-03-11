import { RangeSchedeContattoEnum } from '../../enum/range-schede-contatto';
import { ClassificazioneSchedaContatto } from '../../enum/classificazione-scheda-contatto.enum';

export interface FiltersSchedeContatto {
    gestita?: boolean;
    rangeVisualizzazione?: RangeSchedeContattoEnum | number;
    classificazione?: ClassificazioneSchedaContatto;
}
