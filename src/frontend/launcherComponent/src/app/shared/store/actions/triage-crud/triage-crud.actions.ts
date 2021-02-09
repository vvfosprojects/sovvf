import { TreeItem } from 'ngx-treeview';
import { ItemTriageData } from '../../../interface/item-triage-data.interface';

export class GetDettagliTipologieByCodTipologia {
    static readonly type = '[Triage-CRUD] Get Dettagli Tipologie by CodTipologia';

    constructor(public codTipologia: number) {
    }
}

export class ClearDettagliTipologie {
    static readonly type = '[Triage-CRUD] Clear Dettagli Tipologie';
}

export class SetDettaglioTipologiaTriage {
    static readonly type = '[Triage-CRUD] Set Dettaglio Tipologia Triage';

    constructor(public codDettaglioTipologia: number) {
    }
}

export class GetTriageByCodDettaglioTipologia {
    static readonly type = '[Triage-CRUD] Get Triage By CodDettaglioTipologia';

    constructor(public codTipologia: number, public codDettaglioTipologia: number) {
    }
}

export class ClearTriage {
    static readonly type = '[Triage-CRUD] Clear Triage';
}

export class GetGeneriMezzo {
    static readonly type = '[Triage-CRUD] Get Generi Mezzo';
}

export class ClearGeneriMezzo {
    static readonly type = '[Triage-CRUD] Clear Generi Mezzo';
}

export class SetNewTriage {
    static readonly type = '[Triage-CRUD] Set New Triage';

    constructor(public triage: TreeItem) {
    }
}

export class SetNewTriageData {
    static readonly type = '[Triage-CRUD] Set New Triage Data';

    constructor(public data: any[]) {
    }
}

export class AddTriage {
    static readonly type = '[Triage] Add Triage';
}

export class UpdateTriage {
    static readonly type = '[Triage] Update Triage';
}

export class DeleteTriage {
    static readonly type = '[Triage] Delete Triage';
}

export class AddTriageData {
    static readonly type = '[Triage-CRUD] Add Triage Data';

    constructor(public itemData: ItemTriageData) {
    }
}

export class UpdateTriageData {
    static readonly type = '[Triage-CRUD] Update Triage Data';

    constructor(public itemData: ItemTriageData) {
    }
}

export class DeleteTriageData {
    static readonly type = '[Triage-CRUD] Delete Triage Data';

    constructor(public itemDataValue: string) {
    }
}
