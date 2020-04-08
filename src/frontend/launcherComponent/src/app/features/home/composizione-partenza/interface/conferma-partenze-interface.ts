import { ComposizioneIdRichiesta } from './composizione/composizione-id-richiesta-interface';
import { Partenza } from '../../../../shared/model/partenza.model';

export interface ConfermaPartenze extends ComposizioneIdRichiesta {
    partenze: Partenza[];
    turno: string;
    idRichiestaDaSganciare?: string;
    idMezzoDaSganciare?: string;
}
