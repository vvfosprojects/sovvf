import {Coordinate} from '../../shared/model/coordinate.model';

export class CentroMappa {
    constructor(
        /**
         * le coordinate del centro mappa
         */
        public coordinate: Coordinate,
        /**
         * il livello di zoom del centro mappa
         */
        public zoom: number
    ) {
    }
}
