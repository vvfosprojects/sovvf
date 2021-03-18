import { FiltroTurnoSquadre } from 'src/app/shared/enum/filtro-turno-composizione-partenza.enum';
import { DescrizioneTipologicaMezzo } from './descrizione-filtro-composizione-interface';

export interface ListaTipologicheMezzi {
    turni: FiltroTurnoSquadre[];
    distaccamenti: DescrizioneTipologicaMezzo[];
    generiMezzi: DescrizioneTipologicaMezzo[];
    stati: DescrizioneTipologicaMezzo[];
}
