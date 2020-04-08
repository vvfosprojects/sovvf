import { Geolocalizzazione } from "./geolocalizzazione";
import { Punto } from "./punto";

export class Cerchio extends Geolocalizzazione {

    public centro: Punto;
    public raggio: number;

    baricentro(): Punto {
        //TODO : Implementare
        return new Punto;
    }

    constructor() {
        super();
    }

}