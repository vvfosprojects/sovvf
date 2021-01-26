export class GetDettagliTipologieByCodTipologia {
    static readonly type = '[TriageModal] Get Dettagli Tipologie by CodTipologia';

    constructor(public codTipologia: number) {
    }
}

export class ClearDettagliTipologie {
    static readonly type = '[TriageModal] Clear Dettagli Tipologie';
}
