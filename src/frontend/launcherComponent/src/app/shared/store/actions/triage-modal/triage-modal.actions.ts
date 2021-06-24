import { PosInterface } from "../../../interface/pos.interface";

export class GetDettagliTipologieByCodTipologia {
    static readonly type = '[TriageChiamataModal] Get Dettagli Tipologie by CodTipologia';

    constructor(public codTipologia: number) {
    }
}

export class ClearDettagliTipologie {
    static readonly type = '[TriageChiamataModal] Clear Dettagli Tipologie';
}

export class SetTipologiaTriageChiamata {
    static readonly type = '[TriageChiamataModal] Set Tipologia Triage Chiamata';

    constructor(public codTipologia: number) {
    }
}

export class ClearTipologiaTriageChiamata {
    static readonly type = '[TriageChiamataModal] Clear Tipologia Triage Chiamata';
}

export class SetDettaglioTipologiaTriageChiamata {
    static readonly type = '[TriageChiamataModal] Set Dettaglio Tipologia Triage Chiamata';

    constructor(public codDettaglioTipologia: number, public pos: PosInterface[]) {
    }
}

export class ClearDettaglioTipologiaTriageChiamata {
    static readonly type = '[TriageChiamataModal] Clear Dettaglio Tipologia Triage Chiamata';
}

export class SetTriageChiamata {
    static readonly type = '[TriageChiamataModal] Set Triage Chiamata';
}

export class ClearTriageChiamata {
    static readonly type = '[TriageChiamataModal] Clear Triage Chiamata';
}


