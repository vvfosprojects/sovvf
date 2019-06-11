import { Localita } from './localita.model';
import { Coordinate } from './coordinate.model';

export class ObiettivoSensibile extends Localita {
    constructor(
        public nome: string,
        public documenti: string[],
        public coordinate: Coordinate,
        public indirizzo?: string
    ) {
        super(coordinate, indirizzo);
    }
}
