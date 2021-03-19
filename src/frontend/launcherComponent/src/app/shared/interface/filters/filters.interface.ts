import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';
import { FiltersSchedeContatto } from './filters-schede.contatto';
import { FiltersGestioneUtenti } from './filters-gestione.utenti';
import { FiltersMezziInServizio } from './filters-mezzi-in.servizio';
import { FiltersRichieste } from './filters.richieste';
import {FiltersTipologiaRichiesta} from './filters-tipologia-richiesta.interface';
import { FiltersDettagliTipologie } from './filters-dettagli-tipologie.interface';

export interface FiltersInterface extends FiltersRichieste, FiltersSchedeContatto, FiltersGestioneUtenti, FiltersMezziInServizio, FiltersTipologiaRichiesta, FiltersDettagliTipologie {
    search: string;
    others?: VoceFiltro[];
}
