import { Componente } from './componente.model';
import { Sede } from './sede.model';
import { StatoSquadra } from '../enum/stato-squadra.enum';

export class Squadra {
    constructor(
        /**
         * Id della squadra
         */
        public id: string,
        /**
         * Il nome della squadra
         */
        public nome: string,
        /**
         * Stato del squadra (InSede, InViaggio, SulPosto,
         * InRientro, Istituto).
         */
        public stato: StatoSquadra,
        /**
         * I componenti della squadra
         */
        public componenti: Componente[],
        /**
         * Distaccamento di appartenza
         */
        public distaccamento: Sede,
        /**
         * Turno di appartenza
         */
        public turno?: string,
        /**
         * Se la squadra ha mezzo pre accoppiato
         */
        public preAccoppiato?: boolean,
    ) {
    }
}
