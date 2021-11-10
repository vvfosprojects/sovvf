import { TreeviewItem } from 'ngx-treeview';
import { ItemSediEmergenzaData } from '../../../interface/item-sedi-emergenza-data.interface';

export class SetNewSediEmergenza {
    static readonly type = '[SediEmergenza-CRUD] Set new Sedi Emergenza';

    constructor(public sediEmergenza: TreeviewItem) {
    }
}

export class SetNewSediEmergenzaData {
    static readonly type = '[SediEmergenza-CRUD] Set new Sedi Emergenza Data';

    constructor(public data: any[]) {
    }
}

export class AddSediEmergenza {
    static readonly type = '[SediEmergenza-CRUD] Add Sedi Emergenza';
}

export class UpdateSediEmergenza {
    static readonly type = '[SediEmergenza-CRUD] Update Sedi Emergenza';
}

export class DeleteSediEmergenza {
    static readonly type = '[SediEmergenza-CRUD] Delete Sedi Emergenza';
}

export class ResetSediEmergenza {
    static readonly type = '[SediEmergenza-CRUD] Reset Sedi Emergenza';
}

export class AddSediEmergenzaData {
    static readonly type = '[SediEmergenza-CRUD] Add Sedi Emergenza Data';

    constructor(public itemData: ItemSediEmergenzaData) {
    }
}

export class UpdateSediEmergenzaData {
    static readonly type = '[SediEmergenza-CRUD] Update Sedi Emergenza Data';

    constructor(public itemData: ItemSediEmergenzaData) {
    }
}

export class DeleteSediEmergenzaData {
    static readonly type = '[SediEmergenza-CRUD] Delete Sedi Emergenza Data';

    constructor(public itemDataValue: string) {
    }
}

export class ClearStateSediEmergenzaCrud {
    static readonly type = '[SediEmergenza-CRUD] Clear State Sedi Emergenza CRUD';
}
