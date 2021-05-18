export class AddPos {
    static readonly type = '[PosModal] Add Pos';

    constructor(public formData: FormData) {
    }
}

export class ResetPosModal {
    static readonly type = '[PosModal] Reset Pos Modal';
}
