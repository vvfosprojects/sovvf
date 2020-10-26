import { DescrizioneTipologicaMezzo } from './descrizione-filtro-composizione-interface';

export interface ListaTipologicheMezzi {
    turni: string[];
    distaccamenti: DescrizioneTipologicaMezzo[];
    generiMezzi: DescrizioneTipologicaMezzo[];
    stati: DescrizioneTipologicaMezzo[];
}
