export class GetDettagliTipologieByCodTipologia {
    static readonly type = '[Triage] Get Dettagli Tipologie by CodTipologia';

    constructor(public codTipologia: number) {
    }
}

export class ClearDettagliTipologie {
    static readonly type = '[Triage] Clear Dettagli Tipologie';
}

export class SetDettaglioTipologiaTriage {
    static readonly type = '[Triage] Set Dettaglio Tipologia Triage';

    constructor(public codDettaglioTipologia: number) {
    }
}

export class GetTriageByCodDettaglioTipologia {
    static readonly type = '[Triage] Get Triage By CodDettaglioTipologia';

    constructor(public codDettaglioTipologia: number) {
    }
}

export class ClearTriage {
    static readonly type = '[Triage] Clear Triage';
}
