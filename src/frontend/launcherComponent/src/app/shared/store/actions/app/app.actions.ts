export class ReloadApp {
    static readonly type = '[App] Reload';
}

export class SetVistaSedi {
    static readonly type = '[App] Sedi correnti';

    constructor(public vistaSedi: string[]) {
    }
}

export class ClearVistaSedi {
    static readonly type = '[App] Clear Sedi correnti';
}

export class SetTimeSync {
    static readonly type = '[App] Set Time Sync';

    constructor(public time: number) {
    }
}
