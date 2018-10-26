import {Coordinate} from '../../shared/model/coordinate.model';

export class CentroMappa {
    constructor(
        public coordinate: Coordinate,
        public zoom: number
    ) {
    }
}
