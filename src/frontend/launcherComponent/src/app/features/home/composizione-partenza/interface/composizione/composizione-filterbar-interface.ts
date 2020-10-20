import { Squadra } from '../../../../../shared/model/squadra.model';
import { Mezzo } from '../../../../../shared/model/mezzo.model';

export interface ComposizioneFilterbar {
    CodiceDistaccamento?: string[];
    StatoMezzo?: string[];
    TipoMezzo?: string[];
    Squadre?: Squadra[];
    Mezzo?: Mezzo;
}
