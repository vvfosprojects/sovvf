import { Sede } from '../model/sede.model';

export interface AllertaSedeEmitInterface {
    codRichiesta: string;
    sedi: Sede[];
    motivazione?: string;
    generiMezzi?: string[];
}
