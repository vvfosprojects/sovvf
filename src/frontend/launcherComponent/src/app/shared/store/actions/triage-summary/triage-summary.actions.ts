import { TriageSummary } from '../../../interface/triage-summary.interface';

export class SetTriageSummary {
    static readonly type = '[TriageSummary] Set Triage Summary';

    constructor(public triageSummary: TriageSummary[]) {
    }
}

export class ClearTriageSummary {
    static readonly type = '[TriageSummary] Clear Triage Summary';
}

export class SetSchedaContattoTriageSummary {
    static readonly type = '[TriageSummary] Set Scheda Contatto Triage Summary';

    constructor(public codScheda: string) {
    }
}
