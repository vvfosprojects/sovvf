import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { TrasferimentoChiamataService } from 'src/app/core/service/trasferimento-chiamata/trasferimento-chiamata.service';
import { TreeviewSelezione } from 'src/app/shared/model/treeview-selezione.model';
import { GetRichiesteTrasferibili } from '../../actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';

export interface TrasferimentoChiamataModalStateModel {
    trasferimentoChiamata: Array<TrasferimentoChiamata>;
    codiciRichiesteTrasferibili: string[];
    trasferimentoChiamataForm: {
        model?: {
            codiceRichesta: string;
            operatore: string;
            sedeDa: TreeviewSelezione[];
            sedeA: TreeviewSelezione[];
            data: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const TrasferimentoChiamataModalStateDefaults: TrasferimentoChiamataModalStateModel = {
    trasferimentoChiamata: undefined,
    codiciRichiesteTrasferibili: undefined,
    trasferimentoChiamataForm: {
        model: {
            codiceRichesta: undefined,
            operatore: undefined,
            sedeDa: undefined,
            sedeA: undefined,
            data: undefined,
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@State<TrasferimentoChiamataModalStateModel>({
    name: 'trasferimentoChiamataModal',
    defaults: TrasferimentoChiamataModalStateDefaults
})

export class TrasferimentoChiamataModalState {

    constructor(private trasferimentoChiamataService: TrasferimentoChiamataService) {
    }

    @Selector()
    static codiciRichiesteTrasferibili(state: TrasferimentoChiamataModalStateModel) {
        return state.codiciRichiesteTrasferibili;
    }

    @Selector()
    static formValid(state: TrasferimentoChiamataModalStateModel) {
        return state.trasferimentoChiamataForm.status !== 'INVALID';
    }

    @Action(GetRichiesteTrasferibili)
    getRichiesteTrasferibili({ patchState }: StateContext<TrasferimentoChiamataModalStateModel>) {
        this.trasferimentoChiamataService.getRichiesteTrasferibili().subscribe((codiciRichieste: string[]) => {
            patchState({
                codiciRichiesteTrasferibili: codiciRichieste
            });
        });
    }
}
