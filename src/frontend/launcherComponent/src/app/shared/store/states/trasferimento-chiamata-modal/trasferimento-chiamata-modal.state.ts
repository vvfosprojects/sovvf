import { AddTrasferimentoChiamata, TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { TrasferimentoChiamataService } from 'src/app/core/service/trasferimento-chiamata/trasferimento-chiamata.service';
import { TreeviewSelezione } from 'src/app/shared/model/treeview-selezione.model';
import { GetRichiesteTrasferibili, RequestAddTrasferimentoChiamata } from '../../actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';

export interface TrasferimentoChiamataModalStateModel {
    trasferimentoChiamata: Array<TrasferimentoChiamata>;
    codiciRichiesteTrasferibili: string[];
    trasferimentoChiamataForm: {
        model?: {
            codiceRichiesta: string;
            operatore: string;
            sedeA: TreeviewSelezione[];
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
            codiceRichiesta: undefined,
            operatore: undefined,
            sedeA: undefined
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
    static sedeSelezionata(state: TrasferimentoChiamataModalStateModel) {
        return state.trasferimentoChiamataForm.model.sedeA;
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

    @Action(RequestAddTrasferimentoChiamata)
    requestAddTrasferimentoChiamata({ getState }: StateContext<TrasferimentoChiamataModalStateModel>) {
        const state = getState();
        const form = state.trasferimentoChiamataForm.model;
        const obj = {
            codRichiesta: form.codiceRichiesta,
            codSedeA: form.sedeA[0].idSede
        } as AddTrasferimentoChiamata;
        this.trasferimentoChiamataService.addTrasferimentoChiamata(obj).subscribe(() => {
        });
    }
}
