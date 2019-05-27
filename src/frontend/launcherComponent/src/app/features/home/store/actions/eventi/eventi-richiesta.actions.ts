import { EventoRichiesta } from '../../../../../shared/model/evento-richiesta.model';

export class SetIdRichiestaEventi {
    static readonly type = '[EventiRichiesta] Set Id Richiesta';

    constructor(public idRichiesta: string) {
    }
}

export class GetEventiRichiesta {
    static readonly type = '[EventiRichiesta] Get Eventi Richieste';

    constructor(public idRichiesta: string) {
    }
}

export class SetEventiRichiesta {
    static readonly type = '[EventiRichiesta] Set Eventi Richieste';

    constructor(public eventi: EventoRichiesta[]) {
    }
}

export class ClearEventiRichiesta {
    static readonly type = '[EventiRichiesta] Clear Eventi Richieste';
}
