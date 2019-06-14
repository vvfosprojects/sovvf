import { Mezzo } from './mezzo.model';
import { Squadra } from './squadra.model';
import { TurnoPartenza } from './turno-partenza';

export class Partenza {
    constructor(
        public squadre: Squadra[],
        public mezzo?: Mezzo,
        public turno?: TurnoPartenza
    ) { }
}
