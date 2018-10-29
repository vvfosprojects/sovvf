import {Sede} from './sede.model';

export class Operatore {
    constructor(
        public username: string,
        public nome: string,
        public cognome: string,
        public codiceFiscale: string,
        public validoDa?: Date,
        public validoFinoA?: Date,
        public attivo?: boolean,
        public password?: string,
        public tipo?: string,
        public sede?: Sede
    ) { }
}
