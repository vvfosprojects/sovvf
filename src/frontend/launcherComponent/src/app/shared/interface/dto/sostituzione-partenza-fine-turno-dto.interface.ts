import { SostituzioneInterface } from '../sostituzione.interface';

export interface SostituzionePartenzaFineTurnoDtoInterface {
    idRichiesta: string;
    dataOraOperazione: Date;
    sostituzioni: SostituzioneInterface[];
}
