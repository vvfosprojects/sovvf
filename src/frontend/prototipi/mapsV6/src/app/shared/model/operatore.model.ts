import {Sede} from './sede.model';

export class Operatore {
    constructor(
        public user: string,
        public nome: string,
        public cognome: string,
        public codiceFiscale: string,
        public tipo?: string,
        public password?: string,
        public sede?: Sede
    ) { }
}
