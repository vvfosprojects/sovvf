import { AreaMappaOptions } from '../../features/home/maps/maps-model/area-mappa-query.interface';
import { AreaMappa } from '../../features/home/maps/maps-model/area-mappa-model';

export function AreaMappaFiltrata(areaMappa: AreaMappa, options?: AreaMappaOptions) {
    return {
        ...areaMappa,
        ...options
    };
}
