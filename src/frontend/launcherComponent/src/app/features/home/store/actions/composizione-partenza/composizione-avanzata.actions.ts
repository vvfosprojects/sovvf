export class GetListeCoposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';

    constructor(public filtroLista?: any, public filtri?: any) {
    }
}

export class SetFiltriAttiviCoposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';
}
