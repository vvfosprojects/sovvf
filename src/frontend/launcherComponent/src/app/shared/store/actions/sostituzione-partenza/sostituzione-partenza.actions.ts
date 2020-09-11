export class GetListaMezziSquadre {
    static readonly type = '[SostituzionePartenza] Get Lista Mezzi Squadre';

    constructor(public idRichiesta: string) {
    }
}

export class SetListaMezziSquadre {
    static readonly type = '[SostituzionePartenza] Set Lista Mezzi Squadre';

    constructor(public listaMezziSquadre: any) {
    }
}

export class StartListaComposizioneLoading {
    static readonly type = '[SostituzionePartenza] Start Lista Composizione Loading';
}

export class StopListaComposizioneLoading {
    static readonly type = '[SostituzionePartenza] Stop Lista Composizione Loading';
}
