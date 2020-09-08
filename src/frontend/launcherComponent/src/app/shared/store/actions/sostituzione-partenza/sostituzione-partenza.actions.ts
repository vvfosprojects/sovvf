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
