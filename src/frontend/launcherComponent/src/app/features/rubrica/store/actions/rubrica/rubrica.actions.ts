import { UpdateVoceRubricaInterface, VoceRubrica } from '../../../../../shared/interface/rubrica.interface';

export class GetRubrica  {
    static readonly type = '[Rubrica] Get Rubrica';

    constructor(public page?: number) {
    }
}

export class SetRubrica  {
    static readonly type = '[Rubrica] Set Voci Rubrica';

    constructor(public vociRubrica: VoceRubrica[]) {
    }
}

export class AddVoceRubrica  {
    static readonly type = '[Rubrica] Add Voce Rubrica';
}

export class UpdateVoceRubrica {
    static readonly type = '[Rubrica] Update Voce Rubrica';

    constructor(public voceRubrica: UpdateVoceRubricaInterface) {
    }
}

export class DeleteVoceRubrica {
    static readonly type = '[Rubrica] Delete Voce Rubrica';

    constructor(public idVoceRubrica: DeleteVoceRubrica) {
    }
}
