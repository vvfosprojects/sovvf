import { Squadra } from '../model/squadra.model';
import { Mezzo } from '../model/mezzo.model';
import { InfoRichiesta } from './info-richiesta.interface';
import { ConteggioGruppoMezzi } from './conteggio-gruppo-mezzi';

export interface MezzoInServizio {
    mezzo: MezzoInServizoInfo;
    squadre: Squadra[];
}

class MezzoInServizoInfo {

    constructor(
        /**
         * Contiene le proprietà del mezzo
         */
        public mezzo: Mezzo,
        /**
         * contiene le info della richiesta sulla quale è assegnato il mezzo
         */
        public infoRichiesta?: InfoRichiesta,
        /**
         * contiene le informazioni dei mezzi raggruppati
         */
        public conteggi?: ConteggioGruppoMezzi
    ) {
    }
}
