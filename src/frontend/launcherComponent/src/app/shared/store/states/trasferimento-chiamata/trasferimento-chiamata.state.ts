import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { State, Selector } from '@ngxs/store';
import { TrasferimentoChiamataService } from 'src/app/core/service/trasferimento-chiamata/trasferimento-chiamata.service';
import { TreeviewSelezione } from 'src/app/shared/model/treeview-selezione.model';

export interface TrasferimentoChiamataStateModel {
    trasferimentoChiamata: Array<TrasferimentoChiamata>;
    trasferimentoChiamataForm: {
        model?: {
            id: string;
            operatore: string;
            codice: number;
            sedeDa: TreeviewSelezione[];
            sedeA: TreeviewSelezione[];
            data: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const TrasferimentoChiamataStateDefaults: TrasferimentoChiamataStateModel = {
    trasferimentoChiamata: undefined,
    trasferimentoChiamataForm: {
        model: {
            id: undefined,
            operatore: undefined,
            codice: undefined,
            sedeDa: undefined,
            sedeA: undefined,
            data: undefined,
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

    @State<TrasferimentoChiamataStateModel>({
        name: 'trasferimentoChiamata',
        defaults: TrasferimentoChiamataStateDefaults
    })

    export class TrasferimentoChiamataState {
        @Selector()
        static formValid(state: TrasferimentoChiamataStateModel) {
            return state.trasferimentoChiamataForm.status !== 'INVALID';
        }

        constructor(private trasferimentoChiamataService: TrasferimentoChiamataService) {
        }

        @Selector()
        static sedeSelezionata(state: TrasferimentoChiamataStateModel) {
            return state.trasferimentoChiamataForm.model.sedeDa , state.trasferimentoChiamataForm.model.sedeA ;
        }
        
    }