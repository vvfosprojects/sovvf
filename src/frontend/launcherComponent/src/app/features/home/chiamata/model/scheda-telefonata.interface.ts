import { ChiamataMarker } from '../../maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../../shared/enum/azione-chiamata.enum';

export interface SchedaTelefonataInterface {
    tipo: string;
    nuovaRichiesta: SintesiRichiesta;
    markerChiamata: ChiamataMarker;
    azioneChiamata?: AzioneChiamataEnum;
}
