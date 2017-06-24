import { Geolocalizzazione } from "app/pages/shared/classes/geo/geolocalizzazione";

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