import { Mezzo } from '../../../../shared/model/mezzo.model';
import { InfoRichiesta } from '../../../../shared/interface/info-richiesta.interface';
import { ConteggioGruppoMezzi } from '../../../../shared/interface/conteggio-gruppo-mezzi';

export class MezzoMarker {

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
