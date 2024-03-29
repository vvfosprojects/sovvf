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
         * Id della squadra
         */
        public idSquadra: string,
        /**
         * Codice della squadra
         */
        public codice: string,
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
        /**
         * I membri della squadra
         */
        public membri?: Componente[],
    ) {
    }
}
