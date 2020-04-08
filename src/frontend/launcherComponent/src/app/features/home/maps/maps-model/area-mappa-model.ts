import { Coordinate } from '../../../../shared/model/coordinate.model';

export class AreaMappa {
    constructor(
        /**
         * le coordinate del top-right dell'area della mappa
         */
        public topRight: Coordinate,
        /**
         * le coordinate del bottom-left dell'area della mappa
         */
        public bottomLeft: Coordinate
    ) {
    }
}
