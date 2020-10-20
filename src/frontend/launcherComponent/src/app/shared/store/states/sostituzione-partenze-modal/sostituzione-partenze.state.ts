import { Action, Selector, State, StateContext } from '@ngxs/store';
import { NotificaInterface } from '../../../interface/notifica.interface';
import { AddNotifica, GetListaNotifiche, SetListaNotifiche, SetNotificheLette } from '../../actions/notifiche/notifiche.actions';
import { Injectable } from '@angular/core';

export interface ModificaPartenzeStateModel {
    listaNotifiche: NotificaInterface[];
    nuoveNotifiche: number;
}

export const ModificaPartenzeStateModelDefaults: ModificaPartenzeStateModel = {
    listaNotifiche: undefined,
    nuoveNotifiche: undefined
};

@Injectable()
@State<ModificaPartenzeStateModel>({
    name: 'modificaPartenze',
    defaults: ModificaPartenzeStateModelDefaults
})
export class SostituzionePartenzeState {

    @Selector()
    static listaNotifiche(state: ModificaPartenzeStateModel): NotificaInterface[] {
        return state.listaNotifiche;
    }

    @Action(GetListaNotifiche)
    getListaNotifiche({ dispatch }: StateContext<ModificaPartenzeStateModel>): void {
    }
}
