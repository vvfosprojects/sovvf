import { AddTrasferimentoChiamata, TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { TrasferimentoChiamataService } from 'src/app/core/service/trasferimento-chiamata/trasferimento-chiamata.service';
import { GetRichiesteTrasferibili, RequestAddTrasferimentoChiamata } from '../../actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { Injectable } from '@angular/core';
import { Sede } from '../../../model/sede.model';
import { ConcorrenzaState } from '../concorrenza/concorrenza.state';
import { AuthState } from '../../../../features/auth/store/auth.state';
import { ConcorrenzaInterface } from '../../../interface/concorrenza.interface';
import { TipoConcorrenzaEnum } from '../../../enum/tipo-concorrenza.enum';

export interface TrasferimentoChiamataModalStateModel {
    trasferimentoChiamata: Array<TrasferimentoChiamata>;
    codiciRichiesteTrasferibili: string[];
    trasferimentoChiamataForm: {
        model?: {
            codiceRichiesta: string;
            sedeDa: Sede;
            sedeA: Sede;
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
            sedeDa: undefined,
            sedeA: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@Injectable()
@State<TrasferimentoChiamataModalStateModel>({
    name: 'trasferimentoChiamataModal',
    defaults: TrasferimentoChiamataModalStateDefaults
})

export class TrasferimentoChiamataModalState {

    constructor(private trasferimentoChiamataService: TrasferimentoChiamataService,
                private store: Store) {
    }

    @Selector()
    static codiciRichiesteTrasferibili(state: TrasferimentoChiamataModalStateModel): string[] {
        return state.codiciRichiesteTrasferibili;
    }

    @Selector()
    static sedeSelezionata(state: TrasferimentoChiamataModalStateModel): Sede {
        return state.trasferimentoChiamataForm.model.sedeA;
    }

    @Selector()
    static formValid(state: TrasferimentoChiamataModalStateModel): boolean {
        return state.trasferimentoChiamataForm.status !== 'INVALID';
    }

    @Action(GetRichiesteTrasferibili)
    getRichiesteTrasferibili({ patchState }: StateContext<TrasferimentoChiamataModalStateModel>): void {
        this.trasferimentoChiamataService.getRichiesteTrasferibili().subscribe((codiciRichieste: string[]) => {
            const currentUser = this.store.selectSnapshot(AuthState.currentUser);
            const concorrenza = this.store.selectSnapshot(ConcorrenzaState.concorrenza);
            const richiesteConcorrenza = concorrenza?.filter((c: ConcorrenzaInterface) => c.type === TipoConcorrenzaEnum.Richiesta && c.idOperatore !== currentUser.id);
            const codiciRichiesteConcorrenza = richiesteConcorrenza?.map((c: ConcorrenzaInterface) => c.value);
            let codiciRichiesteTrasferibili = [] as string[];
            if (richiesteConcorrenza?.length) {
                codiciRichieste.forEach((codiceRichiesta: string) => {
                    if (!codiciRichiesteConcorrenza.includes(codiceRichiesta)) {
                        codiciRichiesteTrasferibili.push(codiceRichiesta);
                    }
                });
            } else {
                codiciRichiesteTrasferibili = codiciRichieste;
            }
            patchState({
                codiciRichiesteTrasferibili
            });
        });
    }

    @Action(RequestAddTrasferimentoChiamata)
    requestAddTrasferimentoChiamata({ getState }: StateContext<TrasferimentoChiamataModalStateModel>): void {
        const state = getState();
        const form = state.trasferimentoChiamataForm.model;
        const obj = {
            codChiamata: form.codiceRichiesta,
            codSedeDa: form.sedeDa.codice,
            codSedeA: form.sedeA.codice
        } as AddTrasferimentoChiamata;
        this.trasferimentoChiamataService.addTrasferimentoChiamata(obj).subscribe(() => {
        });
    }
}
