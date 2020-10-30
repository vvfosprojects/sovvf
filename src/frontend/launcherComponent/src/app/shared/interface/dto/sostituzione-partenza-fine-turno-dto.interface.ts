import { SostituzioneInterface } from '../sostituzione.interface';

export interface SostituzionePartenzaFineTurnoDto {
    idRichiesta: string;
    dataOraOperazione: Date;
    sostituzioni: SostituzioneInterface[];
}
