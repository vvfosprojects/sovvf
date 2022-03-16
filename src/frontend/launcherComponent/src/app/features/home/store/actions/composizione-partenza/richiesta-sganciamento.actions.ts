import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class SetRichiestaSganciamento {
    static readonly type = '[MezziComposizione] Set Richiesta Sganciamento';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class UpdateRichiestaSganciamento {
    static readonly type = '[MezziComposizione] Update Richiesta Sganciamento';
}
