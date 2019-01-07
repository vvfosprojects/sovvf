import { Squadra } from '../../shared/model/squadra.model';
import { MezzoComposizione } from '../interface/mezzo-composizione-interface';

export class BoxPartenza {
    constructor(
        public id: number,
        public mezzo?: MezzoComposizione,
        public squadra: Squadra[] = []
    ) {
    }
}
