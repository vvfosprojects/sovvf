import { Action, Selector, State, StateContext } from '@ngxs/store';
import { NotificaInterface } from '../../../interface/notifica.interface';
import { AddNotifica, GetListaNotifiche, SetListaNotifiche, SetNotificheLette } from '../../actions/notifiche/notifiche.actions';
import { insertItem, patch } from '@ngxs/store/operators';
import { makeCopy } from '../../../helper/function';
import { Injectable } from '@angular/core';

export interface NotificheStateModel {
    listaNotifiche: NotificaInterface[];
    nuoveNotifiche: number;
}

export const NotificheStateModelDefaults: NotificheStateModel = {
    listaNotifiche: undefined,
    nuoveNotifiche: undefined
};

@Injectable()
@State<NotificheStateModel>({
    name: 'notifiche',
    defaults: NotificheStateModelDefaults
})
export class NotificheState {

    @Selector()
    static listaNotifiche(state: NotificheStateModel): NotificaInterface[] {
        return state.listaNotifiche;
    }

    @Selector()
    static nuoveNotifiche(state: NotificheStateModel): number {
        return state.nuoveNotifiche;
    }

    // todo: se necessario implementare creando un service "NotificheService"
    @Action(GetListaNotifiche)
    getListaNotifiche({ dispatch }: StateContext<NotificheStateModel>): void {
    }

    @Action(SetListaNotifiche)
    setListaNotifiche({ patchState }: StateContext<NotificheStateModel>, action: SetListaNotifiche): void {
        patchState({
            listaNotifiche: action.notifiche
        });
    }

    @Action(AddNotifica)
    addNotifica({ getState, setState }: StateContext<NotificheStateModel>, action: AddNotifica): void {
        const nuoveNotifiche = getState().nuoveNotifiche;
        const countNuoveNotifiche = nuoveNotifiche ? makeCopy(nuoveNotifiche) : 0;
        setState(
            patch({
                listaNotifiche: insertItem<NotificaInterface>(action.notifica),
                nuoveNotifiche: countNuoveNotifiche + 1
            })
        );
    }

    @Action(SetNotificheLette)
    setNotificheLette({ patchState }: StateContext<NotificheStateModel>): void {
        patchState({
            nuoveNotifiche: 0
        });
    }
}
