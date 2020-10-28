import { SostituzioneInterface } from '../../../interface/sostituzione.interface';
import { Partenza } from '../../../model/partenza.model';

export class SetListaPartenzeSostituzioneFineTurno {
    static readonly type = '[SostituzioneFineTurno] Set Lista Partenze Sostituzione Fine Turno';

    constructor(public partenze: Partenza[]) {
    }
}

export class SetPartenzaMontante {
    static readonly type = '[SostituzioneFineTurno] Set Partenza Montante';

    constructor(public partenza: Partenza) {
    }
}

export class SetSostituzioni {
    static readonly type = '[SostituzioneFineTurno] Set Sostituzioni';
}

export class UpdateSostituzione {
    static readonly type = '[SostituzioneFineTurno] Update Sostituzione';

    constructor(public codSquadraMontante: string, public codSquadraSmontante: string, public codMezzoSmontante: string) {
    }
}

export class ConfirmSostituzioni {
    static readonly type = '[SostituzioneFineTurno] Confirm Sostituzioni';
}

export class ClearSostituzioneFineTurno {
    static readonly type = '[SostituzioneFineTurno] Clear Sostituzione Fine Turno';
}
