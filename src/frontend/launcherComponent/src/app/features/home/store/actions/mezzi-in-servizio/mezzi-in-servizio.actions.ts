import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { MezzoInServizio } from '../../../../../shared/interface/mezzo-in-servizio.interface';

export class GetMezziInServizio {
    static readonly type = '[MezziInServizio] Get Mezzi In Servizio';
}

export class SetMezziInServizio {
    static readonly type = '[MezziInServizio] Set Mezzi In Servizio';

    constructor(public mezzi: MezzoInServizio[]) {
    }
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
