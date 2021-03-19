import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { SquadraComposizione } from './squadra-composizione-interface';

export interface MezzoComposizione {
    id: string;
    mezzo: Mezzo;
    km: string;
    coordinate?: Coordinate;
    tempoPercorrenza: string;
    idRichiesta?: string;
    squadrePreaccoppiate?: SquadraComposizione[];
    listaSquadre?: SquadraComposizione[];
    indirizzoIntervento?: string;
}
