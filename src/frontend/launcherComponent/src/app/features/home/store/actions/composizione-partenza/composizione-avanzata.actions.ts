export class GetListeCoposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';

    constructor(public filtri?: any,
                public onlySquadreComposizione?: boolean,
                public onlyMezziComposizione?: boolean) {
    }
}
