import { Turno } from '../../features/navbar/turno/turno.model';
import { OFFSET_SYNC_TIME, REF_SHIFT_MAP, REF_TIME } from '../../core/settings/referral-time';
import * as moment from 'moment';

export function calcolaTurno(): Turno {
    const initTime = moment(REF_TIME);
    const nowUnix = moment.now() + OFFSET_SYNC_TIME[0];
    // console.log(nowUnix);
    // const nowTest = 1554451200000;
    const now = moment(nowUnix);
    const turni = Math.floor(now.diff(initTime, 'hours') / 12);
    const precedente = scaleTurni(roundTurni(turni), 'prev');
    const attuale = roundTurni(turni);
    const successivo = scaleTurni(roundTurni(turni), 'next');

    // console.log(`precedente: ${precedente}`);
    // console.log(`attuale: ${attuale}`);
    // console.log(`successivo: ${successivo}`);

    function roundTurni(_turni: number): number {
        if (_turni > 8) {
            return (_turni % 8);
        } else if (turni === 8) {
            return 0;
        } else {
            return turni;
        }
    }

    function scaleTurni(_turni: number, scala: string): number {
        let turno = _turni;
        switch (scala) {
            case 'next': {
                turno += 1;
                if (turno === 8) {
                    turno = 0;
                }
            }
                break;
            case 'prev': {
                turno -= 1;
                if (turno === -1) {
                    turno = 7;
                }
            }
                break;
            default:
                return undefined;
        }
        return turno;
    }

    return new Turno(REF_SHIFT_MAP.get(precedente), REF_SHIFT_MAP.get(attuale), REF_SHIFT_MAP.get(successivo));
}
