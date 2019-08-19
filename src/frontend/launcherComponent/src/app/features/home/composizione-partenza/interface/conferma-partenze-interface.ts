import { BoxPartenza } from './box-partenza-interface';
import { ComposizioneIdRichiesta } from './composizione/composizione-id-richiesta-interface';
import { Partenza } from '../../../../shared/model/partenza.model';

export interface ConfermaPartenze extends ComposizioneIdRichiesta {
    partenze: BoxPartenza[] | Partenza[]; // Todo da vedere bene con back-end quale dei due modelli, perchè nello sganciamento viene utilizzato Partenza???
    turno: string;
    idRichiestaDaSganciare?: string;
    idMezzoDaSganciare?: string;
}
