import { Mezzo } from '../model/mezzo.model';

export interface MezzoActionInterface {
    mezzo: Mezzo;
    action?: string;
    data?: Date;
    codRichiesta?: string;
    listaMezzi?: boolean;
    azioneIntervento?: string;
}
