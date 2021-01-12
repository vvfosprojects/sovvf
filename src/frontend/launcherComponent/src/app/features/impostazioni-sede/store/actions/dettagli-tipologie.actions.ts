import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';

export class GetDettagliTipologie {
    static readonly type = '[DettagliTipologie] Get Dettagli Tipologie';

    constructor(public page?: number) {
    }
}

export class SetDettagliTipologie {
    static readonly type = '[DettagliTipologie] Set Dettagli Tipologie';

    constructor(public dettagliTipologie: DettaglioTipologia[]) {
    }
}

export class SetRicercaDettagliTipologie {
    static readonly type = '[DettagliTipologie] Set Ricerca Dettagli Tipologie';

    constructor(public ricerca: string) {
    }
}

export class ClearRicercaDettagliTipologia {
    static readonly type = '[DettagliTipologie] Clear Ricerca Dettagli Tipologie';
}
