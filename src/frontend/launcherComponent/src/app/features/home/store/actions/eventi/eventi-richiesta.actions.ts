import { EventoRichiesta } from '../../../../../shared/model/evento-richiesta.model';

export class SetIdRichiestaEventi {
    static readonly type = '[EventiRichiesta] Set Codice Richiesta';

    constructor(public codice: string) {
    }
}

export class GetEventiRichiesta {
    static readonly type = '[EventiRichiesta] Get Eventi Richieste';
}

export class SetEventiRichiesta {
    static readonly type = '[EventiRichiesta] Set Eventi Richieste';

    constructor(public eventi: EventoRichiesta[]) {
    }
}

export class SetListaTarghe {
    static readonly type = '[EventiRichiesta] Set Eventi Lista Targhe';
}

export class SetFiltroTargaMezzo {
    static readonly type = '[EventiRichiesta] Set Filtro Targa Mezzo';

    constructor(public filtroTargaMezzo: string[]) {
    }
}

export class FiltraEventiRichiesta {
    static readonly type = '[EventiRichiesta] Lista Eventi Richieste Filtrata';
}

export class ClearEventiRichiesta {
    static readonly type = '[EventiRichiesta] Clear Eventi Richieste';
}


export class ToggleIconeNomeClasseEvento {
  static readonly type = '[EventiRichiesta] Toggle Icone Nome Classe Evento';
}
