import { AreaMappaQuery } from '../../features/home/maps/maps-model/area-mappa-query.interface';
import { AreaMappa } from '../../features/home/maps/maps-model/area-mappa-model';
import { FiltroMezzi } from '../../features/home/maps/maps-model/filtro-mezzi.interface';
import { FiltroRichieste } from '../../features/home/maps/maps-model/filtro-richieste.interface';
import { Markers } from '../enum/markers.enum';

export function AreaMappaFiltrata(areaMappa: AreaMappa, filtro?: FiltroMezzi | FiltroRichieste, tipo?: Markers) {
    const areaMappaQuery = {} as AreaMappaQuery;
    areaMappaQuery.bottomLeft = areaMappa.bottomLeft;
    areaMappaQuery.topRight = areaMappa.topRight;
    if (filtro && tipo) {
        switch (tipo) {
            case Markers.Mezzi:
                areaMappaQuery.filtroMezzi = filtro;
                break;
            case Markers.Richieste:
                areaMappaQuery.filtroRichieste = filtro;
        }
    }
    console.log('AreaMappaFiltrata', areaMappaQuery);
    return areaMappaQuery;
}
