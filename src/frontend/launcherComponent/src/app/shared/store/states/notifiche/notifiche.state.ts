import { Action, Selector, State, StateContext } from '@ngxs/store';
import { NotificaInterface } from '../../../interface/notifica.interface';
import { AddNotifica, GetListaNotifiche, SetListaNotifiche, SetNotificheLette } from '../../actions/notifiche/notifiche.actions';
import { insertItem, patch } from '@ngxs/store/operators';
import { makeCopy } from '../../../helper/function';
import { TipoNotifica } from '../../../enum/tipo-notifica.enum';

export interface NotificheStateModel {
    listaNotifiche: NotificaInterface[];
    nuoveNotifiche: number;
}

export const NotificheStateModelDefaults: NotificheStateModel = {
    listaNotifiche: [
        {
            tipo: TipoNotifica.TrasferimentoChiamata,
            titolo: 'Titolo più lungo perchè sii',
            descrizione: 'Descrizione notifica notifica notifica notifica notifica',
            data: new Date().toISOString()
        },
        {
            tipo: TipoNotifica.TrasferimentoChiamata,
            titolo: 'Titolo',
            descrizione: 'Descrizione notifica',
            data: new Date().toISOString()
        },
        {
            tipo: TipoNotifica.TrasferimentoChiamata,
            titolo: 'Titolo',
            descrizione: 'Descrizione notifica',
            data: new Date().toISOString()
        },
    ],
    nuoveNotifiche: undefined
};

@State<NotificheStateModel>({
    name: 'notifiche',
    defaults: NotificheStateModelDefaults
})
export class NotificheState {

    @Selector()
    static listaNotifiche(state: NotificheStateModel) {
        return state.listaNotifiche;
    }

    @Selector()
    static nuoveNotifiche(state: NotificheStateModel) {
        return state.nuoveNotifiche;
    }

    // todo: se necessario implementare creando un service "NotificheService"
    @Action(GetListaNotifiche)
    getListaNotifiche({ dispatch }: StateContext<NotificheStateModel>) {
    }

    @Action(SetListaNotifiche)
    setListaNotifiche({ patchState }: StateContext<NotificheStateModel>, action: SetListaNotifiche) {
        patchState({
            listaNotifiche: action.notifiche
        });
    }

    @Action(AddNotifica)
    addNotifica({ getState, setState }: StateContext<NotificheStateModel>, action: AddNotifica) {
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
    setNotificheLette({ patchState }: StateContext<NotificheStateModel>) {
        patchState({
            nuoveNotifiche: 0
        });
    }
}
