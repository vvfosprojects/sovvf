import { Mezzo } from './mezzo.model';
import { Squadra } from './squadra.model';

export class Partenza {
    constructor(
        public mezzi: Mezzo[],
        public squadre: Squadra[]
    ) { }
}
