import { Componente } from "app/sintesi-richiesta/componente.model";

export class Squadra {
    // non dimenticare di inserire un campo che indichi se la squadra
    // è ancora impegnata sulla richiesta, o l'eventuale data in cui
    // si è liberata.
    constructor(
        public nome: string,
        public componenti: Componente[]
    ) {}
}
