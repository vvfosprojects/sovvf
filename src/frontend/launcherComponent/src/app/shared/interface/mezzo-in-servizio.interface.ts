import { Squadra } from '../model/squadra.model';
import { MezzoMarker } from '../../features/home/maps/maps-model/mezzo-marker.model';

export interface MezzoInServizio {
    mezzo: MezzoMarker;
    squadre: Squadra[];
}
