export class Meteo {
    constructor(
        /* Stato del meteo. Es: 'Soleggiato' */
        public descrizione: string,
        /* Icona del meteo. */
        public icona: string,
        /* Umidita presente nell'aria */
        public umidita: number,
        /* Temperatura attuale */
        public temperatura: number,
        /* Velocità del vento */
        public vento: number,
        /* Direzione del vento */
        public direzione: DirezioneVento
    ) { }
}

export interface DirezioneVento {
    gradi: number;
    cardinali: string;
}
