import { TrasferimentoChiamata, DeleteTrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';


export class SetTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Set Trasferimento Chiamata';

    constructor(public TrasferimentoChiamata: TrasferimentoChiamata[]) {
    }
}

export class GetCategorieEnti {
    static readonly type = '[TrasferimentoChiamata] Get Categorie Trasferimento Chiamata';
}

export class RequestAddTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Request Add Trasferimento Chiamata';
}

export class RequestUpdateTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Request Update Trasferimento Chiamata';
}

export class RequestDeleteTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Request Delete Trasferimento Chiamata';

    constructor(public ente: DeleteTrasferimentoChiamata) {
    }
}

export class ClearFormTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Clear Form Trasferimento Chiamata';
}
