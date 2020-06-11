import { Tipologia } from '../../../../shared/model/tipologia.model';

export class ClearDataHome {
    static readonly type = '[Home] Clear Data';
}

export class GetDataHome {
    static readonly type = '[Home] Get Data from API';
}

export class SetDataTipologie {
    static readonly type = '[Navbar Component] Set Data Tipologie';

    constructor(public tipologie: Tipologia[]) {
    }
}
