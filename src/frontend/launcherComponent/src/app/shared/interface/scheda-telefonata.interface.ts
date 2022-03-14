import { ChiamataMarker } from '../../features/maps/maps-model/chiamata-marker.model';
import { AzioneChiamataEnum } from '../enum/azione-chiamata.enum';
import { RichiestaForm } from './forms/richiesta-form.model';

export interface SchedaTelefonataInterface {
    tipo: string;
    markerChiamata: ChiamataMarker;
    formValue?: RichiestaForm;
    azioneChiamata?: AzioneChiamataEnum;
}
