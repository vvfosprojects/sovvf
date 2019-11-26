import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';

export class SetListaSchedeContatto {
    static readonly type = '[SchedeContatto] Set Lista Schede Contatto';

    constructor(public schedeContatto: SchedaContatto[]) { }
}

export class SetSchedaContattoTelefonata {
    static readonly type = '[SchedeContatto] Set Scheda Contatto Telefonata';

    constructor(public schedaContatto: SchedaContatto) { }
}

export class ClearSchedaContattoTelefonata {
    static readonly type = '[SchedeContatto] Clear Scheda Contatto Telefonata';
}

export class SetSchedaContattoHover {
    static readonly type = '[SchedeContatto] Set Scheda Contatto Hover';

    constructor(public codiceSchedaContatto: string) { }
}

export class ClearSchedaContattoHover {
    static readonly type = '[SchedeContatto] Clear Scheda Contatto Hover';
}
