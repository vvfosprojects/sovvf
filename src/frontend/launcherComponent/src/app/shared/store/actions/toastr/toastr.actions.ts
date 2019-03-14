
export class ShowToastr {
    static readonly type = '[Toastr] Show Toast';

    constructor(public type: string, public title: string, public message: string, public duration?: number) {
    }
}

export class SetToastr {
    static readonly type = '[Toastr] Set Toast';

    constructor(public type: string, public title: string, public message: string, public timeout?: number) {
    }
}
