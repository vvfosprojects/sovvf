import { DescrizioneFiltroComposizione } from './descrizione-filtro-composizione-interface';

export interface ListaFiltriComposizione {
    distaccamenti: DescrizioneFiltroComposizione[];
    generiMezzi: DescrizioneFiltroComposizione[];
    stati: DescrizioneFiltroComposizione[];
}
