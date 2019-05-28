import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

export class GetPreAccoppiati {
    static readonly type = '[PreAccoppiati] Get PreAccoppiati';
}

export class SetPreAccoppiati {
    static readonly type = '[PreAccoppiati] Set PreAccoppiati';

    constructor(public boxPartenza: BoxPartenza[]) {
    }
}
