import { BoxMezzi } from '../../features/home/boxes/boxes-model/box-mezzi.model';
import { BoxPersonale } from '../../features/home/boxes/boxes-model/box-personale.model';
import { BoxInterventi } from '../../features/home/boxes/boxes-model/box-interventi.model';
import { MezzoMarker } from '../../features/home/maps/maps-model/mezzo-marker.model';
import { SedeMarker } from '../../features/home/maps/maps-model/sede-marker.model';
import { RichiestaMarker } from '../../features/home/maps/maps-model/richiesta-marker.model';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { ChiamataMarker } from '../../features/home/maps/maps-model/chiamata-marker.model';

export interface Welcome {
    boxListaMezzi: BoxMezzi;
    boxListaPersonale: BoxPersonale;
    boxListaInterventi: BoxInterventi;
    listaMezziMarker: MezzoMarker[];
    listaSediMarker: SedeMarker[];
    listaRichiesteMarker: RichiestaMarker[];
    listaSintesi: SintesiRichiesta[];
    listaChiamateInCorso: ChiamataMarker[];
}
