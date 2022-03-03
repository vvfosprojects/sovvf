import { RuoloFunzionarioSo } from './ruolo-funzionario-so.enum';

export class BoxFunzionariSo {
    constructor(
        /**
         * E' il codice fiscale della persona, utile come chiave per eventuali approfondimenti sull'istanza
         */
        public codiceFiscale: string,
        /**
         * Qualifica della persona, visibile in interfaccia (per es. 'VCTI')
         */
        public descrizioneQualifica: string,
        /**
         * Nominativo della persona, visibile in interfaccia (per es. 'Daniela Fares')
         */
        public nominativo: string,
        /**
         * Indica se il ruolo del Funzionario
         */
        public ruolo: RuoloFunzionarioSo
    ) {
    }
}
