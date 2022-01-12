import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { GetCodiciRichieste } from '../../actions/gestisci-scheda-contatto-modal/gestisci-scheda-contatto-modal.actions';
import { SintesiRichiesteService } from '../../../../core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesta } from '../../../model/sintesi-richiesta.model';

export interface GestisciSchedaContattoModalStateModel {
    gestisciSchedaContattoForm: {
        model?: {
            codiceRichiesta: string
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
    codiciRichieste: string[];
}

export const GestisciSchedaContattoModalStateDefaults: GestisciSchedaContattoModalStateModel = {
    gestisciSchedaContattoForm: {
        model: {
            codiceRichiesta: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    },
    codiciRichieste: undefined
};

@Injectable()
@State<GestisciSchedaContattoModalStateModel>({
    name: 'gestisciSchedaContattoModal',
    defaults: GestisciSchedaContattoModalStateDefaults
})

export class GestisciSchedaContattoModalState {

    constructor(private richiesteService: SintesiRichiesteService) {
    }

    @Selector()
    static formValue(state: GestisciSchedaContattoModalStateModel): { codiceRichiesta: string } {
        return state.gestisciSchedaContattoForm.model;
    }

    @Selector()
    static formValid(state: GestisciSchedaContattoModalStateModel): boolean {
        return state.gestisciSchedaContattoForm.status !== 'INVALID';
    }

    @Selector()
    static codiciRichieste(state: GestisciSchedaContattoModalStateModel): string[] {
        return state.codiciRichieste;
    }

    @Action(GetCodiciRichieste)
    getCodiciRichieste({ patchState }: StateContext<GestisciSchedaContattoModalStateModel>): void {
        this.richiesteService.getRichieste(null, null).subscribe((res: { sintesiRichiesta: SintesiRichiesta[] }) => {
            patchState({
                codiciRichieste: res.sintesiRichiesta.map((r: SintesiRichiesta) => {
                    return r.codiceRichiesta ? r.codiceRichiesta : r.codice;
                })
            });
        });
    }
}
