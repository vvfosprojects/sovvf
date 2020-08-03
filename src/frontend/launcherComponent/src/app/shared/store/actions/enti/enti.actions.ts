import { Ente } from 'src/app/shared/interface/ente.interface';



export class GetEnti  {
    static readonly type = '[Enti] Get Enti';

    constructor(public page?: number) {
    }
}

export class SetEnti  {
    static readonly type = '[Enti] Set Enti';

    constructor(public enti: Ente[]) {
    }
}
 
export class AddEnte  {
    static readonly type = '[Enti] Add Ente';

    constructor(public ente: AddEnte) {
    }
}

export class UpdateEnte {
    static readonly type = '[Enti] Update Ente';

    constructor(public ente: UpdateEnte) {
    }
}

export class DeleteEnte {
    static readonly type = '[Enti] Delete Ente';
    
    constructor(public idEnte: DeleteEnte) {
    }
}
