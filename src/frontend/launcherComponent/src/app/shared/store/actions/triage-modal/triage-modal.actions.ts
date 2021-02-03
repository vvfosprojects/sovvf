export class GetDettagliTipologieByCodTipologia {
    static readonly type = '[TriageChiamataModal] Get Dettagli Tipologie by CodTipologia';

    constructor(public codTipologia: number) {
    }
}

export class ClearDettagliTipologie {
    static readonly type = '[TriageChiamataModal] Clear Dettagli Tipologie';
}
