import { ChiamataMarker } from '../../maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';

export interface SchedaTelefonataInterface {
    tipo: string;
    nuovaRichiesta: SintesiRichiesta;
    markerChiamata: ChiamataMarker;
}
