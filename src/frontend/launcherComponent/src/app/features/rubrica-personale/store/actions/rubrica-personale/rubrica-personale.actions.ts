import { RubricaPersonale } from '../../../../../shared/interface/rubrica-personale.interface';

export class GetRubricaPersonale {
    static readonly type = '[RubricaPersonale] Get Rubrica Personale';

    constructor(public page?: number) {
    }
}

export class SetRubricaPersonale {
    static readonly type = '[RubricaPersonale] Set Voci Rubrica Personale';

    constructor(public vociRubricaPersonale: RubricaPersonale[]) {
    }
}
