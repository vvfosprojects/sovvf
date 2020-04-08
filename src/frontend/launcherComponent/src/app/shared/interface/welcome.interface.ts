import { BoxMezzi } from '../../features/home/boxes/boxes-model/box-mezzi.model';
import { BoxPersonale } from '../../features/home/boxes/boxes-model/box-personale.model';
import { BoxInterventi } from '../../features/home/boxes/boxes-model/box-interventi.model';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { ChiamataMarker } from '../../features/home/maps/maps-model/chiamata-marker.model';
import { CentroMappa } from '../../features/home/maps/maps-model/centro-mappa.model';
import { ListaTipologicheMezzi } from '../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { ContatoriSchedeContatto } from './contatori-schede-contatto.interface';
import { Tipologia } from '../model/tipologia.model';
import { ResponseInterface } from './response.interface';

export interface Welcome {
    boxListaMezzi: BoxMezzi;
    boxListaPersonale: BoxPersonale;
    boxListaInterventi: BoxInterventi;
    listaSintesi: ResponseInterface;
    listaChiamateInCorso: ChiamataMarker[];
    centroMappaMarker: CentroMappa;
    listaFiltri: ListaTipologicheMezzi;
    infoNue: ContatoriSchedeContatto;
    tipologie: Tipologia[];
}
