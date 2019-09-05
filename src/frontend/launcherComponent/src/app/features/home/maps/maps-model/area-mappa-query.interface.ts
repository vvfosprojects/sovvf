import { Coordinate } from '../../../../shared/model/coordinate.model';
import { FiltroMezzi } from './filtro-mezzi.interface';
import { FiltroRichieste } from './filtro-richieste.interface';

export interface AreaMappaQuery {
    topRight: Coordinate;
    bottomLeft: Coordinate;
    filtroMezzi?: FiltroMezzi;
    filtroRichieste?: FiltroRichieste;
}
