import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';


export class GetTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Get Trasferimento Chiamata';

    constructor(public page?: number) {
    }
}

export class SetTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Set Voci Trasferimento Chiamata';

    constructor(public vociTrasferimentoChiamata: TrasferimentoChiamata[]) {
    }
}

export class AddVoceTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Add Voce Trasferimento Chiamata';
}

export class UpdateVoceTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Update Voce Trasferimento Chiamata';

    constructor(public voceTrasferimentoChiamata: TrasferimentoChiamata) {
    }
}

export class DeleteVoceTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Delete Voce Trasferimento Chiamata';

    constructor(public idVoceTrasferimentoChiamata: string) {
    }
}