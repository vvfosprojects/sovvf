import { TurnoCalendario } from '../../features/navbar/turno/model/turno-calendario.model';
import { OFFSET_SYNC_TIME, REF_SHIFT_MAP, REF_TIME } from '../../core/settings/referral-time';
import * as moment from 'moment';

export function calcolaTurnoCalendario(): TurnoCalendario {
    const initTime = moment(REF_TIME);
    const nowUnix = moment.now() + OFFSET_SYNC_TIME[0];
    const now = moment(nowUnix);
    const turni = Math.floor(now.diff(initTime, 'hours') / 12);
    const precedente = scaleTurni(roundTurni(turni), 'prev');
    const attuale = roundTurni(turni);
    const successivo = scaleTurni(roundTurni(turni), 'next');

    // console.log(nowUnix);
    // const nowTest = 1554451200000;
    // console.log(`precedente: ${precedente}`);
    // console.log(`attuale: ${attuale}`);
    // console.log(`successivo: ${successivo}`);

    function roundTurni(turniLength: number): number {
        if (turniLength > 8) {
            return (turniLength % 8);
        } else if (turni === 8) {
            return 0;
        } else {
            return turni;
        }
    }

    function scaleTurni(turniLength: number, scala: string): number {
        let turno = turniLength;
        switch (scala) {
            case 'next': {
                turno += 1;
                if (turno === 8) {
                    turno = 0;
                }
                break;
            }
            case 'prev': {
                turno -= 1;
                if (turno === -1) {
                    turno = 7;
                }
                break;
            }
            default:
                return undefined;
        }
        return turno;
    }

    return new TurnoCalendario(REF_SHIFT_MAP.get(precedente), REF_SHIFT_MAP.get(attuale), REF_SHIFT_MAP.get(successivo));
}
