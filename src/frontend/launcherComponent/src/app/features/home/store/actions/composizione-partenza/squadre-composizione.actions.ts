import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';

export class GetSquadreComposizione {
    static readonly type = '[SquadreComposizione] Get Squadre Composizione';
}

export class SetSquadreComposizione {
    static readonly type = '[PreAccoppiati] Set Squadre Composizione';

    constructor(public squadraComposizione: SquadraComposizione[]) {
    }
}
