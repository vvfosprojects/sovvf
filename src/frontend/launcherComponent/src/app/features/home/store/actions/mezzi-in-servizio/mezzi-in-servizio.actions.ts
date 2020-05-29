import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { MezzoInServizio } from '../../../../../shared/interface/mezzo-in-servizio.interface';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';

export class GetMezziInServizio {
    static readonly type = '[MezziInServizio] Get Mezzi In Servizio';
}

export class SetMezziInServizio {
    static readonly type = '[MezziInServizio] Set Mezzi In Servizio';

    constructor(public mezzi: MezzoInServizio[]) {
    }
}

export class FilterMezziInServizio {
    static readonly type = '[MezziInServizio] Filter Mezzi In Servizio';
}

export class SetFiltroMezziInServizio {
    static readonly type = '[MezziInServizio] Set Filtro Mezzi In Servizio';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ClearFiltriMezziInServizio {
    static readonly type = '[MezziInServizio] Clear Filtri Mezzi In Servizio';
}

export class SetMezzoInServizioHover {
    static readonly type = '[MezziInServizio] Set Mezzo In Servizio Hover';

    constructor(public idMezzo: string) {
    }
}

export class ClearMezzoInServizioHover {
    static readonly type = '[MezziInServizio] Clear Mezzo In Servizio Hover';
}

export class SetMezzoInServizioSelezionato {
    static readonly type = '[MezziInServizio] Set Mezzo In Servizio Selezionato';

    constructor(public idMezzo: string) {
    }
}

export class ClearMezzoInServizioSelezionato {
    static readonly type = '[MezziInServizio] Clear Mezzo In Servizio Selezionato';
}
