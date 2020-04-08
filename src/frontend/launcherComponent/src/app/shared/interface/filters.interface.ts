import { VoceFiltro } from '../../features/home/filterbar/ricerca-group/filtri-richieste/voce-filtro.model';

export interface FiltersInterface {
    search: string;
    others?: VoceFiltro[];
}
