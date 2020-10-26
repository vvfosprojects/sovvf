import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';
import { FiltersSchedeContattoInterface } from './filters-schede-contatto.interface';
import { FiltersGestioneUtentiInterface } from './filters-gestione-utenti.interface';
import { FiltersMezziInServizioInterface } from './filters-mezzi-in-servizio.interface';

export interface FiltersInterface extends FiltersSchedeContattoInterface, FiltersGestioneUtentiInterface, FiltersMezziInServizioInterface {
    search: string;
    others?: VoceFiltro[];
}
