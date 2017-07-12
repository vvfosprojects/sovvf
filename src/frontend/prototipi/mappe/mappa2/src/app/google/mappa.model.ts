
export class PuntiMappaGoogleInput {

     constructor(
        public codice: string,
        public tipologia: string,
        public indirizzo: string,
        public descrizione: string,
        public latitudine: number,
        public longitudine: number,
        public marker: string
     ) { }

}

export class PuntiMappaGoogleOutput {

     constructor(
        public latitudine: number,
        public longitudine: number
     ) { }

}