import { AppFeatures } from '../../../../../shared/enum/app-features.enum';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { ViewComponentStateModel } from '../../../../../shared/interface/view.interface';

export class ChangeView {
    static readonly type = '[ChangeView] Update visualizzazione';

    constructor(public modalita: AppFeatures) {
    }
}

export class ToggleChiamata {
    static readonly type = '[Chiamata] Toggle chiamata';

    constructor(public toggle?: boolean) {
    }
}

export class ToggleComposizione {
    static readonly type = '[Composizione] Toggle composizione';

    constructor(public modalita?: Composizione) {
    }
}

export class TurnOffComposizione {
    static readonly type = '[Composizione] TurnOff composizione';
}

export class SwitchComposizione {
    static readonly type = '[Composizione] Switch composizione';

    constructor(public modalita: Composizione) {
    }
}

export class SaveView {
    static readonly type = '[ChangeView] Stato visualizzazione salvata';

    constructor(public state: any) {
    }
}

export class ToggleModifica {
    static readonly type = '[Modifica] Toggle modifica';

    constructor(public toggle?: boolean) {
    }
}

export class ToggleMezziInServizio {
    static readonly type = '[MezziInServizio] Toggle mezzi in servizio';
}

export class ToggleSchedeContatto {
    static readonly type = '[SchedeContatto] Toggle schede contatto';
}

export class ClearViewState {
    static readonly type = '[ViewState] Clear view state';
}
