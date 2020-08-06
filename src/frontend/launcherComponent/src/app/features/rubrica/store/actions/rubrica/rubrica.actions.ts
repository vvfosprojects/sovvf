import { CategoriaVoceRubrica, DeleteVoceRubricaInterface, UpdateVoceRubricaInterface, VoceRubrica } from '../../../../../shared/interface/rubrica.interface';

export class GetRubrica {
    static readonly type = '[Rubrica] Get Rubrica';

    constructor(public page?: number) {
    }
}

export class SetRubrica {
    static readonly type = '[Rubrica] Set Voci Rubrica';

    constructor(public vociRubrica: VoceRubrica[]) {
    }
}

export class RequestAddVoceRubrica {
    static readonly type = '[Rubrica] Request Add Voce Rubrica';
}

export class RequestUpdateVoceRubrica {
    static readonly type = '[Rubrica] Request Update Voce Rubrica';
}

export class RequestDeleteVoceRubrica {
    static readonly type = '[Rubrica] Request Delete Voce Rubrica';

    constructor(public voceRubrica: DeleteVoceRubricaInterface) {
    }
}

export class AddVoceRubrica {
    static readonly type = '[Rubrica] Add Voce Rubrica';
}

export class UpdateVoceRubrica {
    static readonly type = '[Rubrica] Update Voce Rubrica';

    constructor(public voceRubrica: VoceRubrica) {
    }
}

export class DeleteVoceRubrica {
    static readonly type = '[Rubrica] Delete Voce Rubrica';

    constructor(public idVoceRubrica: string) {
    }
}

export class GetCategorieVoceRubrica {
    static readonly type = '[Rubrica] Get Categorie Voce Rubrica';
}

export class SetCategorieVoceRubrica {
    static readonly type = '[Rubrica] Set Categorie Voce Rubrica';

    constructor(public categorieVoceRubrica: CategoriaVoceRubrica[]) {
    }
}

export class ClearFormVoceRubrica {
    static readonly type = '[Rubrica] Clear Form Voce Rubrica';
}
