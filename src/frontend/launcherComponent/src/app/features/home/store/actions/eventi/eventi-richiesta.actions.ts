
export class SetIdRichiestaEventi {
    static readonly type = '[EventiRichiesta] Set Id Richiesta';

    constructor( public idRichiesta: string ) {}
}

export class GetEventiRichiesta {
    static readonly type = '[EventiRichiesta] Get Eventi Richieste';
}
