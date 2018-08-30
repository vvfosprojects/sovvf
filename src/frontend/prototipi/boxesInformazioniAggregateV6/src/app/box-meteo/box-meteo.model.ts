export class BoxMeteo {
    constructor(
        /* Stato del meteo. Es: 'Soleggiato' */
        public descrizione: string,
        /* Umidita presente nell'aria */
        public umidita: string,
        /* Temperatura attuale */
        public temperatura: string,
    ) { }
}
