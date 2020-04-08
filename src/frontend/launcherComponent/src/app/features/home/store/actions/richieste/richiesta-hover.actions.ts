
// GET
export class SetRichiestaHover {
    static readonly type = '[RichiestaHover] Set Richiesta Hover';

    constructor(public idRichiesta: string) {}
}

// CLEAR
export class ClearRichiestaHover {
    static readonly type = '[RichiestaHover] Clear Richiesta Hover';
}
