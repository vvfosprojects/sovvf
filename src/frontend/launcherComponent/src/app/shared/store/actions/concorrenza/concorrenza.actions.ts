import { AddConcorrenzaDtoInterface } from '../../../interface/dto/concorrenza/add-concorrenza-dto.interface';

export class GetConcorrenza {
    static readonly type = '[Concorrenza] Get Concorrenza';
}

export class AddConcorrenza {
    static readonly type = '[Concorrenza] Add Concorrenza';

    constructor(public data: AddConcorrenzaDtoInterface) {
    }
}

export class DeleteConcorrenza {
    static readonly type = '[Concorrenza] Delete Concorrenza';

    constructor(public idConcorrenza: string) {
    }
}

export class DeleteAllConcorrenza {
    static readonly type = '[Concorrenza] Delete All Concorrenza';
}
