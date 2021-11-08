
export class StartLoading {
    static readonly type = '[Loading] Start';
}

export class StopLoading {
    static readonly type = '[Loading] Stop';
}

export class StartBigLoading {
    static readonly type = '[Loading] Start Big';
}

export class StopBigLoading {
    static readonly type = '[Loading] Stop Big';
}

export class AddAnnullaStatoMezzi {
    static readonly type = '[Loading] Add Pb Mezzo';

    constructor(public codMezzo: string) {
    }
}

export class RemoveAnnullaStatoMezzi {
    static readonly type = '[Loading] Remove Pb Mezzo';

    constructor(public codMezzo: string) {
    }
}
