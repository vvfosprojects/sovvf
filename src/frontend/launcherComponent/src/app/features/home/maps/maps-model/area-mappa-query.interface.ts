import { FiltroMezzi } from './filtro-mezzi.interface';
import { FiltroRichieste } from './filtro-richieste.interface';
import { FiltroSchedeContatto } from './filtro-schede-contatto';

export interface AreaMappaOptions {
    filtroMezzi?: FiltroMezzi;
    filtroRichieste?: FiltroRichieste;
    filtroSchedeContatto?: FiltroSchedeContatto;
}
