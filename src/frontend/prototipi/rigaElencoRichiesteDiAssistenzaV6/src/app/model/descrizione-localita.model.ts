export class DescrizioneLocalita {
    constructor(
        /* Indirizzo in formato stringa */
        public indirizzo: string,
        
        /* Latitidine e longitudine ['latitudine','longitudine'] */
        public coordinate: [string,string]
    ) {
    }
}
