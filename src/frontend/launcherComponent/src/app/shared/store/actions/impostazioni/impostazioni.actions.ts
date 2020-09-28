import { Impostazione } from '../../../interface/impostazioni.interface';

export class GetImpostazioniLocalStorage {
    static readonly type = '[Impostazioni] Get Impostazioni';
}

export class PatchImpostazioni {
    static readonly type = '[Impostazioni] Patch Impostazioni';

    constructor(public impostazione: Impostazione) {
    }
}
