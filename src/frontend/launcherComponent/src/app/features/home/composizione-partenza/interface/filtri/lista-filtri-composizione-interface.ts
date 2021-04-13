import { FiltroTurnoSquadre } from 'src/app/shared/enum/filtro-turno-composizione-partenza.enum';
import { TipologicaComposizionePartenza } from './tipologica-composizione-partenza.interface';

export interface ListaTipologicheMezzi {
    turni: FiltroTurnoSquadre[];
    distaccamenti: TipologicaComposizionePartenza[];
    generiMezzi: TipologicaComposizionePartenza[];
    stati: TipologicaComposizionePartenza[];
}
