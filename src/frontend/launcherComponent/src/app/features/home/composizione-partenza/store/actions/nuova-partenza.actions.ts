import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class NuovaPartenza {
    static readonly type = '[ComposizionePartenza] Set nuova partenza';

    constructor(public richiesta: SintesiRichiesta) {
    }
}
