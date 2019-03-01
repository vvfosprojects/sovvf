import { FormChiamataModel } from './form-scheda-telefonata.model';
import { ChiamataMarker } from '../../maps/maps-model/chiamata-marker.model';

export interface SchedaTelefonataInterface {
    azione: string;
    formChiamata: FormChiamataModel;
    markerChiamata: ChiamataMarker;
}
