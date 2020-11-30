import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';
import { FiltersSchedeContattoInterface } from './filters-schede-contatto.interface';
import { FiltersGestioneUtentiInterface } from './filters-gestione-utenti.interface';
import { FiltersMezziInServizioInterface } from './filters-mezzi-in-servizio.interface';
import { FiltersRichiesteInterface } from './filters-richieste.interface';

export interface FiltersInterface extends FiltersRichiesteInterface, FiltersSchedeContattoInterface, FiltersGestioneUtentiInterface, FiltersMezziInServizioInterface {
    search: string;
    others?: VoceFiltro[];
}
