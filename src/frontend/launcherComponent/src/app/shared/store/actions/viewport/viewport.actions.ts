export class SetAvailHeight {
    static readonly type = '[Viewport] Set Window Available Height';

    constructor(public availHeight: any) {
    }
}

export class SetContentHeight {
    static readonly type = '[Viewport] Set Content Height';

    constructor(public contentHeight: number) {
    }
}

