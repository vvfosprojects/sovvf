import { MezzoProvvisorio } from './mezzo.provvisorio.model';
import { SquadraProvvisorio } from './squadra.provvisorio.model';

export class PartenzaProvvisorio {
    constructor(
        public squadre: SquadraProvvisorio[],
        public mezzo?: MezzoProvvisorio
    ) { }
}
