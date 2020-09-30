import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { TrasferimentoChiamataService } from 'src/app/core/service/trasferimento-chiamata/trasferimento-chiamata.service';
import { TreeviewSelezione } from 'src/app/shared/model/treeview-selezione.model';
import { GetRichiesteTrasferibili } from '../../actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { GestioneUtentiStateModel } from '../../../../features/gestione-utenti/store/states/gestione-utenti/gestione-utenti.state';

export interface AllertaSedeModalStateModel {
    allertaSedeForm: {
        model?: {
            sedi: TreeviewSelezione[]
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const AllertaSedeModalStateDefaults: AllertaSedeModalStateModel = {
    allertaSedeForm: {
        model: {
            sedi: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@State<AllertaSedeModalStateModel>({
    name: 'allertaSede',
    defaults: AllertaSedeModalStateDefaults
})

export class AllertaSedeModalState {

    constructor() {
    }

    @Selector()
    static sedeSelezionata(state: AllertaSedeModalStateModel) {
        return state.allertaSedeForm.model.sedi;
    }

    @Selector()
    static formValid(state: AllertaSedeModalStateModel) {
        return state.allertaSedeForm.status !== 'INVALID';
    }

    @Action(GetRichiesteTrasferibili)
    getRichiesteTrasferibili({ patchState }: StateContext<AllertaSedeModalStateModel>) {

    }
}
