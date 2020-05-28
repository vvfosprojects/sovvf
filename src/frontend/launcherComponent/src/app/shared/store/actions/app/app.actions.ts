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

export class SetMapLoaded {
    static readonly type = '[App] Map is fully loaded';

    constructor(public mapIsLoaded: boolean) {
    }
}

export class SetGestioneUtentiLoaded {
    static readonly type = '[App] Gestione Utenti is fully loaded';

    constructor(public gestioneUtentiIsLoaded: boolean) {
    }
}

