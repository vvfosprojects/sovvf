import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';


export class GetListaTrasferimentiChiamate {
    static readonly type = '[TrasferimentoChiamata] Get Lista Trasferimenti Chiamate';

    constructor(public page?: number) {
    }
}

export class SetListaTrasferimentiChiamate {
    static readonly type = '[TrasferimentoChiamata] Set Voci Trasferimento Chiamata';

    constructor(public vociTrasferimentoChiamata: TrasferimentoChiamata[]) {
    }
}

export class AddTrasferimentoChiamata {
    static readonly type = '[TrasferimentoChiamata] Add Voce Trasferimento Chiamata';
}
