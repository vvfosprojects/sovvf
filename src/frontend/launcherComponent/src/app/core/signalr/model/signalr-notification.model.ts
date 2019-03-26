import { SignalRNotificationInterface } from '../interface/signalr-notification.interface';

export class SignalRNotification implements SignalRNotificationInterface {
    CodiceSede: string;
    idUtente: number;
    NominativoUtente?: string;
    ActionObj?: any;

    constructor(codiceSede: string, idUtente: string, nominativoUtente?: string, actionObj?: object) {
        this.CodiceSede = codiceSede;
        this.ActionObj = JSON.stringify(actionObj);
        this.NominativoUtente = nominativoUtente;
        this.idUtente = +idUtente;
    }
}
