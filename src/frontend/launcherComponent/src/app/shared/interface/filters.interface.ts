import { VoceFiltro } from '../../features/home/filterbar/filtri-richieste/voce-filtro.model';

export interface FiltersInterface {
    search: string;
    others?: VoceFiltro[];
    codiciSede?: string[];
}
