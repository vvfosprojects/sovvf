import { Geolocalizzazione } from "./geolocalizzazione";

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