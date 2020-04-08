import { Geolocalizzazione } from "app/shared/classes/geo/geolocalizzazione";

export class Punto extends Geolocalizzazione {

    public latitudine: number;
    public longitudine: number;

    public punto: Punto;

    baricentro(): Punto {
        //TODO : Implementare
        return this.punto;
    }

    constructor() {
        super();
    }

}