export class SchedaContatto {


     constructor(public idScheda: number,
        public dataOrainserimento: Date,
        public idOperatore: number,
        public idPostazione: string,
        public nomeUtente: string,
        public numTelefono: number,
        public indirizzo: string,
        public infoAddizionali: string,
        public classificazioneNUE: string,
        public attributiClassificazione: string,
        public note: string,
        //Marzotti - modifica in number per assegnare valore da 1 a 5
        public priorita: number,
        public numPersoneCoinvolte: string,
        public competenza: string) {

    }


}
















