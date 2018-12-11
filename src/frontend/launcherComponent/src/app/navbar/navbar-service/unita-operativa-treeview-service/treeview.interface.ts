import { Sede } from '../../../shared/model/sede.model';

export interface LivelliSedi {
    primo: string[];
    secondo: string[];
    terzo: string[];
}

export interface ChildCON {
    testo: string;
    sedi: Sede[];
    error: boolean;
    allChecked: boolean;
}
