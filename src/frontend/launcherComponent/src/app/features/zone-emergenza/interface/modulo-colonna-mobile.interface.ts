import { StatoModuloColonnaMobile } from '../enum/stato-modulo-colonna-mobile.enum';
import { Componente } from '../../../shared/model/componente.model';
import { Mezzo } from '../../../shared/model/mezzo.model';

export interface ModuloColonnaMobile {
    id: string;
    codComando: string;
    nomeModulo: string;
    stato: StatoModuloColonnaMobile;
    mezzi: Mezzo[];
    componenti: Componente[];
}
