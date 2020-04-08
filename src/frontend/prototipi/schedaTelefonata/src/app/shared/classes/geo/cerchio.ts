import { Geolocalizzazione } from "app/shared/classes/geo/geolocalizzazione";
import { Punto } from "app/shared/classes/geo/punto";

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