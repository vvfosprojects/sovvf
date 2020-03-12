import { Utente } from '../../../shared/model/utente.model';

export class SignalRHubConnesso {
    static readonly type = '[signalR] Hub Connesso';
}

export class SignalRHubDisconnesso {
    static readonly type = '[signalR] Hub Disconnesso';
}

export class SetConnectionId {
    static readonly type = '[signalR] Set Connection ID';

    constructor(public connectionId: string) {
    }
}

export class SetUtenteSignalR {
    static readonly type = '[signalR] Set utente SignalR';

    constructor(public utente: Utente) {
    }
}

export class ClearUtenteSignalR {
    static readonly type = '[Utente] Clear utente SignalR';

    constructor(public utente: Utente) {
    }
}

export class SetCodiceSede {
    static readonly type = '[signalR] Set Codice Sede';

    constructor(public codiceSede: string) {
    }
}

export class SetIdUtente {
    static readonly type = '[signalR] Set ID Utente';

    constructor(public idUtente: string) {
    }
}
