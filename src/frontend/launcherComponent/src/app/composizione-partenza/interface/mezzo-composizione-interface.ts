import { MezzoProvvisorio } from '../../shared/model/mezzo.provvisorio.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';

export interface MezzoComposizione {
    id: string;
    mezzo: MezzoProvvisorio;
    km: string;
    coordinate?: Coordinate;
    tempoPercorrenza: string;
    selezionato: boolean;
    hover: boolean;
    bloccato?: boolean;
}
