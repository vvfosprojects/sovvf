import { Geolocalizzazione } from "./geolocalizzazione";
import { Punto } from "./punto";

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