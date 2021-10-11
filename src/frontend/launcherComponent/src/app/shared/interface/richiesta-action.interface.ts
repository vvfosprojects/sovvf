import { StatoRichiestaActions } from '../enum/stato-richiesta-actions.enum';
import { MotivazioneChiusuraRichiestaEnum } from '../enum/motivazione-chiusura-richiesta.enum';
import { EnteInterface } from './ente.interface';

export interface RichiestaActionInterface {
    idRichiesta: string;
    stato: StatoRichiestaActions;
    motivazione?: MotivazioneChiusuraRichiestaEnum;
    entiIntervenuti?: EnteInterface[];
}

