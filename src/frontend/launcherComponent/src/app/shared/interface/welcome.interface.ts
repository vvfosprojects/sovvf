import { BoxMezzi } from '../../features/home/boxes/boxes-model/box-mezzi.model';
import { BoxPersonale } from '../../features/home/boxes/boxes-model/box-personale.model';
import { BoxInterventi } from '../../features/home/boxes/boxes-model/box-interventi.model';
import { ChiamataMarker } from '../../features/maps/maps-model/chiamata-marker.model';
import { CentroMappa } from '../../features/maps/maps-model/centro-mappa.model';
import { ListaTipologicheMezzi } from '../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { ResponseInterface } from './response/response.interface';
import { EnteInterface } from './ente.interface';

export interface Welcome {
    boxListaMezzi: BoxMezzi;
    boxListaPersonale: BoxPersonale;
    boxListaInterventi: BoxInterventi;
    listaSintesi: ResponseInterface;
    listaChiamateInCorso: ChiamataMarker[];
    listaFiltri: ListaTipologicheMezzi;
    rubrica: EnteInterface[];
    zoneEmergenza: string[];
}
