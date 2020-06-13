import { TurnoExtra } from '../../turno/turno-extra.model';

export class GetTurnoExtra {
    static readonly type = '[Turni] Get TurnoExtra';
}

export class SetTurnoExtra {
    static readonly type = '[Turni] Set TurnoExtra';

    constructor(public turnoExtra: TurnoExtra) {
    }
}

export class ClearTurnoExtra {
    static readonly type = '[Turni] Clear TurnoExtra';
}

export class SetTurnoCalendario {
    static readonly type = '[Turni] Set Turno Calendario';
}
