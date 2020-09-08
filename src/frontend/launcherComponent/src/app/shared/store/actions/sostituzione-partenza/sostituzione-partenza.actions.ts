export class GetListaMezziSquadre {
    static readonly type = '[SostituzionePartenza] Get Lista Mezzi Squadre';
}

export class SetListaMezziSquadre {
    static readonly type = '[SostituzionePartenza] Set Lista Mezzi Squadre';

    constructor(public listaMezziSquadre: any) {
    }
}
