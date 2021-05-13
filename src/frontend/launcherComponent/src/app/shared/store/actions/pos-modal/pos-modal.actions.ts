export class AddPos {
    static readonly type = '[PosModal] Add Pos';

    constructor(public formData: FormData) {
    }
}

export class ClearFormPos {
    static readonly type = '[PosModal] Clear Form Pos';
}

export class ResetPosModal {
    static readonly type = '[PosModal] Reset Pos Modal';
}
