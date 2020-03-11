import { Ruolo } from '../../../model/utente.model';

export class SetRuoliUtenteLoggato {
    static readonly type = '[Ruoli] Set Ruoli Utente Loggato';

    constructor(public ruoliUtenteLoggato: Ruolo[]) {
    }
}

export class UpdateRuoliUtenteLoggato {
    static readonly type = '[Ruoli] Update Ruoli Utente Loggato';

    constructor(public ruoliUtenteLoggato: Ruolo[]) {
    }
}

export class ClearRuoliUtenteLoggato {
    static readonly type = '[Ruoli] Clear Ruoli Utente Loggato';
}
