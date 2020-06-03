import { ToastrType } from '../../../enum/toastr';
import { environment } from '../../../../../environments/environment';

export class ShowToastr {
    static readonly type = '[Toastr] Show Toast';

    constructor(public type: ToastrType,
                public title?: string,
                public message?: string,
                public duration?: number,
                public tapToDismiss?: boolean,
                public alwaysVisible = environment.toastr) {
    }
}

export class SetToastr {
    static readonly type = '[Toastr] Set Toast';

    constructor(public type: ToastrType,
                public title?: string,
                public message?: string,
                public timeout?: number,
                public tapToDismiss?: boolean) {
    }
}
