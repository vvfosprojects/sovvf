export class Intervento {
    constructor(
        public codice: string,
        public tipologia: string,
        public indirizzo: string,
        public descrizione: string,
        public longitudine: number,
        public latitudine: number) {}
}
