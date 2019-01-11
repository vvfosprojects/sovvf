import { Mezzo } from '../../shared/model/mezzo.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';

export interface MezzoComposizione {
    id: string;
    mezzo: Mezzo;
    km: string;
    coordinate?: Coordinate;
    tempoPercorrenza: string;
    selezionato: boolean;
    hover: boolean;
    bloccato?: boolean;
}
