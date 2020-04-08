import { AreaMappaOptions } from '../../features/home/maps/maps-model/area-mappa-query.interface';
import { AreaMappa } from '../../features/home/maps/maps-model/area-mappa-model';

export function AreaMappaFiltrata(areaMappa: AreaMappa, options?: AreaMappaOptions) {
    const areaMappaQuery = {
        ...areaMappa,
        ...options
    };
    console.log('AreaMappaFiltrata', areaMappaQuery);
    return areaMappaQuery;
}
