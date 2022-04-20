export class GetListeComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';

    constructor(public options?: { page?: { pageMezzi?: number, pageSquadre?: number } }, public filtroMezzi?: boolean, public filtroSquadre?: boolean, public preaccoppiato?: boolean) {
    }
}

export class UnselectMezziAndSquadreComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Unselect Mezzi and Squadre Composizione Avanzata';
}

export class ClearComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Clear Composizione Partenza Avanzata';
}
