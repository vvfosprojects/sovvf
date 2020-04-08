import { Geolocalizzazione } from "app/pages/shared/classes/geo/geolocalizzazione";
import { Punto } from "app/pages/shared/classes/geo/punto";

export class Poligonale extends Geolocalizzazione {

    public vertici: Punto[];

    baricentro(): Punto {
        //TODO : Implementare
        return new Punto;
    }

    constructor() {
        super();
    }

}