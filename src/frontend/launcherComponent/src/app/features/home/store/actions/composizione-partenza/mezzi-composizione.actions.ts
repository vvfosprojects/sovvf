import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

export class SetListaMezziComposizione {
    static readonly type = '[MezziComposizione] Set Lista Mezzi Composizione';

    constructor(public mezziComposizione: MezzoComposizione[]) {
    }
}

export class AddMezzoComposizione {
    static readonly type = '[MezziComposizione] Add Mezzo Composizione';

    constructor(public mezzo: MezzoComposizione) {
    }
}

export class RemoveMezzoComposizione {
    static readonly type = '[MezziComposizione] Remove Mezzo Composizione';

    constructor(public idMezzo: string) {
    }
}

export class UpdateMezzoComposizione {
    static readonly type = '[MezziComposizione] Update Mezzo Composizione';

    constructor(public mezzo: MezzoComposizione) {
    }
}

export class SelectMezzoComposizione {
    static readonly type = '[MezziComposizione] Select Mezzo Composizione';

    constructor(public idMezzo: string) {
    }
}

export class UnselectMezzoComposizione {
    static readonly type = '[MezziComposizione] Unselect Mezzo Composizione';

    constructor(public idMezzo: string) {
    }
}

export class LockMezzoComposizione {
    static readonly type = '[MezziComposizione] Lock Mezzo Composizione';

    constructor(public idMezzo: string) {
    }
}

export class UnlockMezzoComposizione {
    static readonly type = '[MezziComposizione] Unlock Mezzo Composizione';

    constructor(public idMezzo: string) {
    }
}

export class RequestUnlockMezzoComposizione {
    static readonly type = '[MezziComposizione] Request Unlock Mezzo Composizione';

    constructor(public idMezzo: string) {
    }
}

