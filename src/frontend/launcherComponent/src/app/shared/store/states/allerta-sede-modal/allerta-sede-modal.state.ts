import { State, Selector } from '@ngxs/store';
import { TreeviewSelezione } from 'src/app/shared/model/treeview-selezione.model';
import { Injectable } from '@angular/core';

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

@Injectable()
@State<AllertaSedeModalStateModel>({
    name: 'allertaSede',
    defaults: AllertaSedeModalStateDefaults
})

export class AllertaSedeModalState {

    constructor() {
    }

    @Selector()
    static sedeSelezionata(state: AllertaSedeModalStateModel): TreeviewSelezione[] {
        return state.allertaSedeForm.model.sedi;
    }

    @Selector()
    static formValid(state: AllertaSedeModalStateModel): boolean {
        return state.allertaSedeForm.status !== 'INVALID';
    }
}
