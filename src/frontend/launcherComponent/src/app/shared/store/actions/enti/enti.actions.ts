import { CategoriaEnte, DeleteEnteInterface, Ente } from 'src/app/shared/interface/ente.interface';

export class SetEnti {
    static readonly type = '[Enti] Set Enti';

    constructor(public enti: Ente[]) {
    }
}

export class GetCategorieEnti {
    static readonly type = '[Enti] Get Categorie Enti';
}

export class SetCategorieEnti {
    static readonly type = '[Enti] Set Categorie Enti';

    constructor(public categorie: CategoriaEnte[]) {
    }
}

export class RequestAddEnte {
    static readonly type = '[Enti] Request Add Ente';
}

export class RequestUpdateEnte {
    static readonly type = '[Enti] Request Update Ente';
}

export class RequestDeleteEnte {
    static readonly type = '[Enti] Request Delete Ente';

    constructor(public ente: DeleteEnteInterface) {
    }
}

export class ClearFormEnte {
    static readonly type = '[Enti] Clear Form Ente';
}
