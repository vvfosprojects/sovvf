import { Squadra } from '../../shared/model/squadra.model';
import { MezzoComposizione } from '../interface/composizione-partenza-interface';

export class BoxPartenza {
    constructor(
        public id: number,
        public mezzoComposizione?: MezzoComposizione,
        public squadra: Squadra[] = [],
    ) {
    }
}
