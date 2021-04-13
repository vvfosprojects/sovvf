import { Sede } from '../../../model/sede.model';

export class GetDistaccamenti {
    static readonly type = '[Distaccamenti] Get Distaccamenti';
}
export class SetDistaccamenti {
    static readonly type = '[Distaccamenti] Set Distaccamenti';

    constructor(public distaccamenti: Sede[]) {
    }
}
