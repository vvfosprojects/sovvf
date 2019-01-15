import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { Mezzo } from 'src/app/shared/model/mezzo.model';

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
