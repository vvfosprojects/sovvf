import { NotificaInterface } from '../../../interface/notifica.interface';

export class GetListaNotifiche {
    static readonly type = '[Notifiche] Get Lista Notifiche';
}

export class SetListaNotifiche {
    static readonly type = '[Notifiche] Set Lista Notifiche';

    constructor(public notifiche: NotificaInterface[]) {
    }
}

export class AddNotifica {
    static readonly type = '[Notifiche] Add Notifica';

    constructor(public notifica: NotificaInterface) {
    }
}

export class SetNotificheLette {
    static readonly type = '[Notifiche] Set Notifiche Lette';

}
