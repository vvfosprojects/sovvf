import { ChiamataMarker } from '../../features/home/maps/maps-model/chiamata-marker.model';
import { AzioneChiamataEnum } from '../enum/azione-chiamata.enum';

export interface SchedaTelefonataInterface {
    tipo: string;
    markerChiamata: ChiamataMarker;
    azioneChiamata?: AzioneChiamataEnum;
}
