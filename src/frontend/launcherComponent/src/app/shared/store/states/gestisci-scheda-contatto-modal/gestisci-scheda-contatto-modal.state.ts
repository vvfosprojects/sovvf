import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { GetCodiciRichieste } from '../../actions/gestisci-scheda-contatto-modal/gestisci-scheda-contatto-modal.actions';
import { SintesiRichiesteService } from '../../../../core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesta } from '../../../model/sintesi-richiesta.model';

export interface GestisciSchedaContattoModalStateModel {
    gestisciSchedaContattoForm: {
        model?: {
            codRichiesta: string
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
    codici: string[];
}

export const GestisciSchedaContattoModalStateDefaults: GestisciSchedaContattoModalStateModel = {
    gestisciSchedaContattoForm: {
        model: {
            codRichiesta: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    },
    codici: undefined
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
    static formValid(state: GestisciSchedaContattoModalStateModel): boolean {
        return state.gestisciSchedaContattoForm.status !== 'INVALID';
    }

    @Action(GetCodiciRichieste)
    getCodiciRichieste({ patchState }: StateContext<GestisciSchedaContattoModalStateModel>): void {
        this.richiesteService.getRichieste(null, null).subscribe((richieste: SintesiRichiesta[]) => {
            patchState({
                codici: richieste.map((r: SintesiRichiesta) => {
                    return r.codiceRichiesta ? r.codiceRichiesta : r.codice;
                })
            });
        });
    }
}
