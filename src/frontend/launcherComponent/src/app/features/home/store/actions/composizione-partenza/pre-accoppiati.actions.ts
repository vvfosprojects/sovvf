import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

export class GetPreAccoppiati {
    static readonly type = '[PreAccoppiati] Get Lista PreAccoppiati';

    constructor(public filtri?: any) {
    }
}

export class SetPreAccoppiati {
    static readonly type = '[PreAccoppiati] Set Lista PreAccoppiati';

    constructor(public boxPartenza: BoxPartenza[]) {
    }
}
