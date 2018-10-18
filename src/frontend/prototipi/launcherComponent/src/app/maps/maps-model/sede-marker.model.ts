import {Sede} from '../../shared/model/sede.model';
import {Coordinate} from '../../shared/model/coordinate.model';
import {Localita} from '../../shared/model/localita.model';

export class SedeMarker implements Sede {
    constructor(
        /**
         * Codice sede
         */
        public codice: string,
        /**
         * Descrizione della sede
         */
        public descrizione: string,
        /**
         * coordinate sede
         */
        public localita: Localita,
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
        return new Coordinate(this.localita.coordinate.latitudine, this.localita.coordinate.longitudine);
    }
}
