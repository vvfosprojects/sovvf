export class AddPos {
    static readonly type = '[PosModal] Add Pos';
}

export class SetSelectedFile {
    static readonly type = '[PosModal] Set Selected File';

    constructor(public file: File) {
    }
}

export class ClearFormPos {
    static readonly type = '[PosModal] Clear Form Pos';
}
