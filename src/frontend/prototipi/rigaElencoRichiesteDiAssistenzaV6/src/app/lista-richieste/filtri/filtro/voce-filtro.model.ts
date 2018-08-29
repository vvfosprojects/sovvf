export class VoceFiltro {
    constructor(
        public codice: Object,
        public descrizione: string,
        public cardinalita: number,
        public selezionato: boolean = false,
        public tooltip: string = ""
    ) {}
}
