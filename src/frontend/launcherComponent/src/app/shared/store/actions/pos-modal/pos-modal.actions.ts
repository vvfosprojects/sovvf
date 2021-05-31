export class AddPos {
    static readonly type = '[PosModal] Add Pos';

    constructor(public formData: FormData) {
    }
}

export class EditPos {
    static readonly type = '[PosModal] Edit Pos';

    constructor(public formData: FormData) {
    }
}

export class DeletePos {
    static readonly type = '[PosModal] Delete Pos';

    constructor(public id: string) {
    }
}

export class ResetPosModal {
    static readonly type = '[PosModal] Reset Pos Modal';
}
