import { Mezzo } from '../../shared/model/mezzo.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';

export class MezzoComposizione {
    constructor(
        public id: string,
        public mezzo: Mezzo,
        public km: string,
        public tempoPercorrenza: string,
        public distaccamento: string,
        public coordinate?: Coordinate
    ) {
    }
}
