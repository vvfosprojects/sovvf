import { SignalRNotificationInterface } from '../interface/signalr-notification.interface';

export class SignalRNotification implements SignalRNotificationInterface {
    CodiciSede: string[];
    idUtente: string;
    NominativoUtente?: string;
    ActionObj?: any;

    constructor(codiciSede: string[], idUtente: string, nominativoUtente?: string, actionObj?: object) {
        this.CodiciSede = codiciSede;
        this.ActionObj = JSON.stringify(actionObj);
        this.NominativoUtente = nominativoUtente;
        this.idUtente = idUtente;
    }
}
