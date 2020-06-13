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

export class UpdateCurrentUser {
    static readonly type = '[Auth] Update current User';

    constructor(public utente: Utente,
                public options?: { localStorage: boolean }) {
    }
}

export class SetLogged {
    static readonly type = '[Auth] Signed In';
}

export class Logout {
    static readonly type = '[Auth] Sign Out';

    constructor(public url = '/home') {
    }
}

export class RecoveryUrl {
    static readonly type = '[Auth] Recovery Url';
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

export class ClearCurrentUser {
    static readonly type = '[Auth] Clear current user';

    constructor(public skipDeleteAll?: boolean) {
    }
}
