import { TriageSummary } from '../../../interface/triage-summary.interface';
import { PosInterface } from '../../../interface/pos.interface';

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

export class SetPosTriageSummary {
    static readonly type = '[TriageSummary] Set Pos Triage Summary';

    constructor(public pos: PosInterface[]) {
    }
}

export class ClearPosTriageSummary {
    static readonly type = '[TriageSummary] Clear Pos Triage Summary';
}
