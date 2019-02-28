import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class RichiestaComposizione {
    static readonly type = '[ComposizionePartenza] Nuova Composizione Partenza';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class TerminaComposizione {
    static readonly type = '[ComposizionePartenza] Termina Composizione Partenza';
}
