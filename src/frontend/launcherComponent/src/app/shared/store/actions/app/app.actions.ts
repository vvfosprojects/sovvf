export class SetAppLoaded {
    static readonly type = '[App] Caricamento...';
}

export class SetAppSede {
    static readonly type = '[App] Sede attuale';

    constructor(public idSede: string[]) {
    }
}

export class SetTimeSync {
    static readonly type = '[App] Set Time Sync';

    constructor(public time: string) {
    }
}
