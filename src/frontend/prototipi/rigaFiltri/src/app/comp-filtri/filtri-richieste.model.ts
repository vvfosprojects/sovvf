export class FiltriRichieste {
    constructor(
        public aperti: boolean,
        public chiusi: boolean,
        public chiamate: boolean,
        public interventi: boolean,
        public interni: boolean,
        public esterni: boolean,
        public presidiato: boolean,
        public nonPresidiato: boolean,
        public chiaveDiRicerca: string
    ) {

    }
}