import { Utente } from '../../../shared/model/utente.model';

export class GetAuth {
    static readonly type = '[Auth] Get Auth';
}

export class SetCurrentJwt {
    static readonly type = '[Auth] Set current Jwt';

    constructor(public currentJwt: string) {
    }
}

export class SetCurrentTicket {
    static readonly type = '[Auth] Set current Ticket';

    constructor(public currentTicket: string) {
    }
}

export class SetCurrentUser {
    static readonly type = '[Auth] Set current User';

    constructor(public currentUser: Utente) {
    }
}

export class CasLogin {
    static readonly type = '[Auth] Cas Login';
}

export class CasResponse {
    static readonly type = '[Auth] Cas Response';

    constructor(public ticket: string) {
    }
}

export class CasLogout {
    static readonly type = '[Auth] Cas Logout';
}

export class ClearAuth {
    static readonly type = '[Auth] Clear auth';
}
