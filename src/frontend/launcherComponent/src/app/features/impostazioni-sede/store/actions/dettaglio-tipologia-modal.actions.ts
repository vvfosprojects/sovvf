import { EnteInterface } from '../../../../shared/interface/ente.interface';

export class RequestAddDettaglioTipologia {
    static readonly type = '[DettaglioTipologiaModal] Request Add Dettaglio Tipologia';
}

export class RequestUpdateDettaglioTipologia {
    static readonly type = '[DettaglioTipologiaModal] Request Update Dettaglio Tipologia';
}

export class RequestDeleteDettaglioTipologia {
    static readonly type = '[DettaglioTipologiaModal] Request Delete Dettaglio Tipologia';

    constructor(public codDettaglioTipologia: number) {
    }
}

export class ClearFormDettaglioTipologia {
    static readonly type = '[DettaglioTipologiaModal] Clear Form Dettaglio Tipologia';
}
