import { AddVoceRubricaInterface, VoceRubrica } from '../../../../../shared/interface/rubrica.interface';

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

    constructor(public voceRubrica: AddVoceRubricaInterface) {
    }
}

export class UpdateVoceRubrica {
    static readonly type = '[Rubrica] Update Voce Rubrica';

    constructor(public ente: UpdateVoceRubrica) {
    }
}

export class DeleteVoceRubrica {
    static readonly type = '[Rubrica] Delete Voce Rubrica';

    constructor(public idVoceRubrica: DeleteVoceRubrica) {
    }
}
