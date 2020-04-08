export class Ruolo {
    constructor(
        public codice : string,
        public nome: string,
        public descrizione: string,
        public codiciPermessi: string[],
        public ordine: number
    ) {}
}
