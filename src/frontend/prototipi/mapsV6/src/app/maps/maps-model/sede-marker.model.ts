import {Sede} from '../../shared/model/sede.model';
import {Coordinate} from '../../shared/model/coordinate.model';

export class SedeMarker implements Sede {
    constructor(
        /**
         * Codice sede
         */
        public codice: number,
        /**
         * Descrizione della sede
         */
        public descrizione: string,
        /**
         * coordinate sede
         */
        public coordinate: Coordinate,
        /**
         * tipologia sede (Es: Comando, Distaccamento)
         */
        public tipo: string,
        /**
         * label (da decidere)
         */
        public label?: string,
        /**
         * icona della sede
         */
        public icona?: string
    ) {
    }

    getCoordinate() {
        return new Coordinate(this.coordinate.latitudine, this.coordinate.longitudine);
    }
}
