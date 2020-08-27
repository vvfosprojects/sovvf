export class EventoRichiesta {
    constructor(
        public id: string,
        public nomeClasseEvento: string,
        public istanteEvento: Date,
        public targa: string,
        public note: string,
        public operatore?: string,
        public sedeOperatore?: string
    ) {
    }

}

