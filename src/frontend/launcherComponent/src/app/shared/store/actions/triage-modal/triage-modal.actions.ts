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

export class SetDettaglioTipologiaTriageChiamata {
    static readonly type = '[TriageChiamataModal] Set Dettaglio Tipologia Triage Chiamata';

    constructor(public codDettaglioTipologia: number) {
    }
}

export class SetTriageChiamata {
    static readonly type = '[TriageChiamataModal] Set Triage Chiamata';
}
