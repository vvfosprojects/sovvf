import { Sede } from '../../../model/sede.model';

export class GetDistaccamenti {
    static readonly type = '[Distaccamenti] Get Distaccamenti';
}

export class GetSediAllerta {
    static readonly type = '[Distaccamenti] Get Sedi Allerta';
}

export class GetSediTrasferimenti {
    static readonly type = '[Distaccamenti] Get Sedi Trasferimenti';
}

export class SetDistaccamenti {
    static readonly type = '[Distaccamenti] Set Distaccamenti';

    constructor(public distaccamenti: Sede[]) {
    }
}

export class SetSediAllerta {
    static readonly type = '[Distaccamenti] Set Sedi Allerta';

    constructor(public sediAllerta: Sede[]) {
    }
}

export class SetSediTrasferimenti {
    static readonly type = '[Distaccamenti] Set Sedi Trasferimenti';

    constructor(public sediTrasferimenti: Sede[]) {
    }
}
