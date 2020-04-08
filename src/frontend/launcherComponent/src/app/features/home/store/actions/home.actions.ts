import { Tipologia } from '../../../../shared/model/tipologia.model';

export class ClearDataHome {
    static readonly type = '[Home] Clear Data';
}

export class GetDataHome {
    static readonly type = '[Home] Get Data from API';
}

export class SetMapLoaded {
    static readonly type = '[Home] Map is fully loaded';
}

export class SetMarkerLoading {
    static readonly type = '[Home] Marker on loading';

    constructor(public loading: boolean) {
    }
}

export class SetDataTipologie {
    static readonly type = '[Navbar Component] Set Data Tipologie';

    constructor(public tipologie: Tipologia[]) {
    }
}
