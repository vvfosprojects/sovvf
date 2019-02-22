import { SchedaTelefonataInterface } from '../../model/scheda-telefonata.interface';
import { FormChiamataModel } from '../../model/form-scheda-telefonata.model';

export class ReducerSchedaTelefonata {
    static readonly type = '[Scheda Telefonata] Reduce completato';

    constructor(public schedaTelefonata: SchedaTelefonataInterface) {
    }
}

export class SetChiamata {
    static readonly type = '[Scheda Telefonata] Set chiamata';

    constructor(public chiamata: FormChiamataModel) {
    }

}

export class InsertChiamata {
    static readonly type = '[Scheda Telefonata] Insert chiamata';

}

export class AnnullaChiamata {
    static readonly type = '[Scheda Telefonata] Annulla chiamata';

}

export class SetCoordinate {
    static readonly type = '[Scheda Telefonata] Set coordinate';

    constructor(public chiamata: FormChiamataModel) {
    }

}
