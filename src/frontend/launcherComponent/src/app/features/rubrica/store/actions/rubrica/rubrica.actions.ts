import { EnteInterface } from '../../../../../shared/interface/ente.interface';

export class GetRubrica {
    static readonly type = '[Rubrica] Get Rubrica';

    constructor(public page?: number) {
    }
}

export class SetRubrica {
    static readonly type = '[Rubrica] Set Voci Rubrica';

    constructor(public vociRubrica: EnteInterface[]) {
    }
}

export class AddVoceRubrica {
    static readonly type = '[Rubrica] Add Voce Rubrica';
}

export class UpdateVoceRubrica {
    static readonly type = '[Rubrica] Update Voce Rubrica';

    constructor(public voceRubrica: EnteInterface) {
    }
}

export class DeleteVoceRubrica {
    static readonly type = '[Rubrica] Delete Voce Rubrica';

    constructor(public idVoceRubrica: string) {
    }
}

export class StartLoadingRubrica {
    static readonly type = '[Rubrica] Start Loading Rubrica';
}

export class StopLoadingRubrica {
    static readonly type = '[Rubrica] Stop Loading Rubrica';
}
