import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetImpostazioniLocalStorage, PatchImpostazioni } from '../../actions/impostazioni/impostazioni.actions';
import { Impostazione, OpzioneImpostazione, TipoImpostazione } from '../../../interface/impostazioni.interface';
import { LSNAME } from '../../../../core/settings/config';
import { patch, updateItem } from '@ngxs/store/operators';
import { Injectable } from '@angular/core';

export interface ImpostazioniStateModel {
    listaImpostazioni: Impostazione[];
}

export const impostazioniStateDefaults: ImpostazioniStateModel = {
    listaImpostazioni: [
        {
            tipo: TipoImpostazione.Box,
            icona: 'fa-window-restore',
            opzioni: [
                {
                    label: 'Visibile',
                    singleValue: {
                        value: true
                    }
                }
            ]
        },
        {
            tipo: TipoImpostazione.EventiRichiesta,
            icona: 'fa-list',
            opzioni: [
                {
                    label: 'Visualizzazione Iniziale',
                    select: {
                        itemsSelect: [
                            {
                                id: '1',
                                desc: 'Icone'
                            },
                            {
                                id: '2',
                                desc: 'Testuale'
                            }
                        ],
                        selected: '1'
                    }
                }
            ]
        }
    ]
};

@Injectable()
@State<ImpostazioniStateModel>({
    name: 'impostazioni',
    defaults: impostazioniStateDefaults
})

export class ImpostazioniState {

    @Selector()
    static listaImpostazioni(state: ImpostazioniStateModel): Impostazione[] {
        return state.listaImpostazioni;
    }

    @Selector()
    static boxAttivi(state: ImpostazioniStateModel): boolean {
        return state.listaImpostazioni.filter((i: Impostazione) => i.tipo === TipoImpostazione.Box)[0].opzioni.filter((o: OpzioneImpostazione) => o.label === 'Visibile')[0].singleValue.value;
    }

    @Selector()
    static visualizzazioneTestualeEventi(state: ImpostazioniStateModel): boolean {
        return state.listaImpostazioni.filter((i: Impostazione) => i.tipo === TipoImpostazione.EventiRichiesta)[0].opzioni.filter((o: OpzioneImpostazione) => o.label === 'Visualizzazione Iniziale')[0].select.selected === '2';
    }

    @Action(GetImpostazioniLocalStorage)
    getImpostazioniLocalStorage({ patchState }: StateContext<ImpostazioniStateModel>): void {
        const impostazioni = localStorage.getItem(LSNAME.impostazioni);
        if (impostazioni) {
            patchState({
                listaImpostazioni: JSON.parse(impostazioni)
            });
        }
    }

    @Action(PatchImpostazioni)
    patchImpostazioni({ getState, setState }: StateContext<ImpostazioniStateModel>, action: PatchImpostazioni): void {
        setState(
            patch({
                listaImpostazioni: updateItem((i: Impostazione) => i.tipo === action.impostazione.tipo, action.impostazione)
            })
        );
        const listaImpostazioni = getState().listaImpostazioni;
        localStorage.setItem(LSNAME.impostazioni, JSON.stringify(listaImpostazioni));
    }
}
