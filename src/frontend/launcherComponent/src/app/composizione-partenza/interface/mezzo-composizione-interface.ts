import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { MezzoProvvisorio } from 'src/app/shared/model/mezzo.provvisorio.model';

export interface MezzoComposizione {
    id: string;
    mezzo: MezzoProvvisorio;
    km: string;
    coordinate?: Coordinate;
    tempoPercorrenza: string;
    selezionato: boolean;
    hover: boolean;
    bloccato?: boolean;
    dataScadenzaTimeout?: Date;
    timeout?: number;
}
