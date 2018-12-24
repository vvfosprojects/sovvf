import { Mezzo } from '../../shared/model/mezzo.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';

export interface MezzoComposizione {
    id: string;
    mezzo: Mezzo;
    km: string;
    tempoPercorrenza: string;
    coordinate?: Coordinate;
    selezionato: boolean;
    hover: boolean;
}
