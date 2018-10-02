import {Sede} from '../../shared/model/sede.model';
import {Coordinate} from '../../shared/model/coordinate.model';

export class SedeMarker {
    constructor(
        public sede: Sede
    ) {
    }

    getCoordinate() {
        return new Coordinate(this.sede.coordinate.latitudine, this.sede.coordinate.longitudine);
    }
}
