import { RubricaPersonale } from '../../../../../shared/interface/rubrica-personale.interface';

export class GetRubricaPersonale {
    static readonly type = '[RubricaPersonale] Get Rubrica Personale';

    constructor(public page?: number, public filtro?: string) {
    }
}

export class SetRubricaPersonale {
    static readonly type = '[RubricaPersonale] Set Voci Rubrica Personale';

    constructor(public vociRubricaPersonale: RubricaPersonale[]) {
    }
}