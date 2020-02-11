import { Priorita } from '../../../../shared/model/sintesi-richiesta.model';
import { Localita } from '../../../../shared/model/localita.model';
import { ClassificazioneSchedaContatto } from '../../../../shared/enum/classificazione-scheda-contatto.enum';

export class SchedaContattoMarker {

    constructor(
        public localita: Localita,
        public codiceScheda: string,
        public priorita: Priorita,
        public codiceOperatore: string,
        public classificazione: ClassificazioneSchedaContatto,
        public gestita: boolean
    ) {
    }

}
