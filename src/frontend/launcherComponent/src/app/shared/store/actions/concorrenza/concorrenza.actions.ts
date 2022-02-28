import { ConcorrenzaInterface } from '../../../interface/concorrenza.interface';
import { AddConcorrenzaDtoInterface } from '../../../interface/dto/concorrenza/add-concorrenza-dto.interface';

export class GetConcorrenza {
    static readonly type = '[Concorrenza] Get Concorrenza';
}

export class SetConcorrenza {
    static readonly type = '[Concorrenza] Set Concorrenza';

    constructor(public data: ConcorrenzaInterface[]) {
    }
}

export class AddConcorrenza {
    static readonly type = '[Concorrenza] Add Concorrenza';

    constructor(public data: AddConcorrenzaDtoInterface) {
    }
}

export class DeleteConcorrenza {
    static readonly type = '[Concorrenza] Delete Concorrenza';

    constructor(public codMezzo?: string, public codSquadra?: string) {
    }
}

export class DeleteAllConcorrenza {
    static readonly type = '[Concorrenza] Delete All Concorrenza';
}
