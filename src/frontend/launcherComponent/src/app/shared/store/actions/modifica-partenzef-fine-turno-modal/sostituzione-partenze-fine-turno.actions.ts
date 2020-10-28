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

export class AddSostituzione {
    static readonly type = '[SostituzioneFineTurno] Add Sostituzione';

    constructor(public sostituzione: SostituzioneInterface) {
    }
}

export class ClearSostituzioneFineTurno {
    static readonly type = '[SostituzioneFineTurno] Clear Sostituzione Fine Turno';
}
