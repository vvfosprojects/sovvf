import { SignalRNotificationInterface } from '../interface/signalr-notification.interface';

export class SignalRNotification implements SignalRNotificationInterface {
    codiciSede: string[];
    idUtente: string;
    nominativoUtente?: string;
    actionObj?: any;

    constructor(codiciSede: string[], idUtente: string, nominativoUtente?: string, actionObj?: object) {
        this.codiciSede = codiciSede;
        this.actionObj = JSON.stringify(actionObj);
        this.nominativoUtente = nominativoUtente;
        this.idUtente = idUtente;
    }
}
