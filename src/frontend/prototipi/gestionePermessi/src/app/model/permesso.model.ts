import { Ruolo } from "./ruolo.model";

export class Permesso {
    constructor(
        public codice : string,
        public nome : string,
        public descrizione: string,
        public ordine: number
    ) {}
}
