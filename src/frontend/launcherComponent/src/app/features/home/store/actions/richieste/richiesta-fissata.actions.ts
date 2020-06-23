export class SetRichiestaFissata {
    static readonly type = '[RichiestaFissata] Set Richiesta Fissata';

    constructor(public idRichiesta: string, public codiceRichiesta: string) {
    }
}

export class ClearRichiestaFissata {
    static readonly type = '[RichiestaFissata] Clear Richiesta Fissata';
}

export class SetEspanso {
    static readonly type = '[RichiestaFissata] Set Espanso';

    constructor(public espanso?: boolean) {
    }
}
