import { ChiamataMarker } from '../../features/home/maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../enum/azione-chiamata.enum';

export interface SchedaTelefonataInterface {
    tipo: string;
    nuovaRichiesta: SintesiRichiesta;
    markerChiamata: ChiamataMarker;
    azioneChiamata?: AzioneChiamataEnum;
}
