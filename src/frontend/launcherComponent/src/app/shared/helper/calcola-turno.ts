import { Turno } from '../../features/navbar/turno/turno.model';
import { REF_SHIFT_MAP, REF_TIME } from '../../core/settings/referral-shift';
import * as moment from 'moment';

export function calcolaTurno(): Turno {
    const initTime = moment(REF_TIME);
    const nowUnix = moment.now();
    // const nowTest = 1554451200000;
    const now = moment(nowUnix);
    const turni = Math.floor(now.diff(initTime, 'hours') / 12);
    const precedente = roundTurni(turni - 1);
    const attuale = roundTurni(turni);
    const successivo = roundTurni(turni + 1);

    function roundTurni(_turni: number): number {
        if (_turni > 8) {
            return (_turni % 8);
        } else if (turni === 8) {
            return 0;
        } else {
            return turni;
        }
    }

    return new Turno(REF_SHIFT_MAP.get(precedente), REF_SHIFT_MAP.get(attuale), REF_SHIFT_MAP.get(successivo));
}
