import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';
import { SchedaContatto } from '../../../../../shared/interface/scheda-contatto.interface';

export class ToggleModalitaMerge {
    static readonly type = '[Merge Schede Contatto] Toggle Modalita Merge Schede Contatto';
}

/**
 * imposta il tipo di classificazione di schede da poter mergiare
 * evita che si uniscano schede di tipo differente
 */
export class SetMergeClassificazione {
    static readonly type = '[Merge Schede Contatto] Set Merge Classificazione Scheda Contatto';

    constructor(public tipoClassificazione: ClassificazioneSchedaContatto) {
    }
}

export class SetMergeSchedaId {
    static readonly type = '[Merge Schede Contatto] Set Merge Scheda Contatto ID';

    constructor(public scheda: SchedaContatto) {
    }
}

export class RemoveSchedaId {
    static readonly type = '[Merge Schede Contatto] Remove Scheda Contatto ID';

    constructor(public payload: string) {
    }
}

export class AddSchedaId {
    static readonly type = '[Merge Schede Contatto] Add Scheda Contatto ID';

    constructor(public payload: string) {
    }
}

export class InitSaveMergeSchedeContatto {
    static readonly type = '[Merge Schede Contatto] Init Save Merge Schede Contatto';
}

export class CheckboxError {
    static readonly type = '[Merge Schede Contatto] Checkbox Error';
}

export class ClearMergeSchedeContatto {
    static readonly type = '[Merge Schede Contatto] Clear State';
}
