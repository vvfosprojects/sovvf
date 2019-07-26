import { Mezzo } from 'src/app/shared/model/mezzo.model';

export class GetMezziInServizio {
    static readonly type = '[MezziInServizio] Get Mezzi In Servizio';
}

export class SetMezziInServizio {
    static readonly type = '[MezziInServizio] Set Mezzi In Servizio';

    constructor(public mezzi: Mezzo[]) {
    }
}

