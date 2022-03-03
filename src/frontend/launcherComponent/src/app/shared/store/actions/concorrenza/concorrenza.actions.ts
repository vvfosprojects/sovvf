import { ConcorrenzaInterface } from '../../../interface/concorrenza.interface';
import { AddConcorrenzaDtoInterface } from '../../../interface/dto/concorrenza/add-concorrenza-dto.interface';
import { TipoConcorrenzaEnum } from '../../../enum/tipo-concorrenza.enum';

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

    constructor(public type: TipoConcorrenzaEnum, public value?: string) {
    }
}

export class DeleteAllConcorrenza {
    static readonly type = '[Concorrenza] Delete All Concorrenza';
}
