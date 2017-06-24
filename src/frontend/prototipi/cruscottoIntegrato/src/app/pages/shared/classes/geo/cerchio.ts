import { Geolocalizzazione } from "app/pages/shared/classes/geo/geolocalizzazione";
import { Punto } from "app/pages/shared/classes/geo/punto";

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