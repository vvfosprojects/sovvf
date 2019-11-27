import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';

export class GetListaSchedeContatto {
  static readonly type = '[SchedeContatto] Get Lista Schede Contatto';
}

export class SetListaSchedeContatto {
  static readonly type = '[SchedeContatto] Set Lista Schede Contatto';

  constructor(public schedeContatto: SchedaContatto[]) {
  }
}

export class SetSchedaContattoLetta {
  static readonly type = '[SchedeContatto] Set Scheda Contatto Letta';

  constructor(public codiceScheda: string, public letta: boolean) {
  }
}

export class SetSchedaContattoGestita {
  static readonly type = '[SchedeContatto] Set Scheda Contatto Gestita';

  constructor(public codiceScheda: string, public gestita: boolean) {
  }
}

export class SetSchedaContattoTelefonata {
  static readonly type = '[SchedeContatto] Set Scheda Contatto Telefonata';

  constructor(public schedaContatto: SchedaContatto) {
  }
}

export class ClearSchedaContattoTelefonata {
  static readonly type = '[SchedeContatto] Clear Scheda Contatto Telefonata';
}

export class SetSchedaContattoHover {
  static readonly type = '[SchedeContatto] Set Scheda Contatto Hover';

  constructor(public codiceSchedaContatto: string) {
  }
}

export class ClearSchedaContattoHover {
  static readonly type = '[SchedeContatto] Clear Scheda Contatto Hover';
}

export class SetFiltroKeySchedeContatto {
  static readonly type = '[SchedeContatto] Set Filtro Key Schede Contatto';

  constructor(public key: string) {
  }
}

export class SetFiltroLettaSchedeContatto {
  static readonly type = '[SchedeContatto] Set Filtro Letta Schede Contatto';

  constructor(public letta: boolean) {
  }
}

export class SetFiltroGestitaSchedeContatto {
  static readonly type = '[SchedeContatto] Set Filtro Gestita Schede Contatto';

  constructor(public gestita: boolean) {
  }
}

export class ClearFiltriSchedeContatto {
  static readonly type = '[SchedeContatto] Clear Filtri Schede Contatto';
}
