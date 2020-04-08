export class ToggleAnimationButton {
    static readonly type = '[Maps Button] Toggle animation';

    constructor(public fix?: boolean) {
    }
}

export class ForceActiveAnimation {
    static readonly type = '[Maps Button] Forza toggle animation: evento rilevante';
}

export class CentraMappaButton {
    static readonly type = '[Maps Button] Centra mappa';
}

export class ToggleAnimation {
    static readonly type = '[Bounce Animation] Toggle effetto';
}
