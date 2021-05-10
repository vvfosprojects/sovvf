export class GetPos {
    static readonly type = '[POS] Get Pos';

    constructor(public page?: number) {
    }
}

export class SetPos {
    static readonly type = '[POS] Set Pos';

    constructor(public pos: any[]) {
    }
}

export class StartLoadingPos {
    static readonly type = '[POS] Start Loading Pos';
}

export class StopLoadingPos {
    static readonly type = '[POS] Stop Loading Pos';
}
