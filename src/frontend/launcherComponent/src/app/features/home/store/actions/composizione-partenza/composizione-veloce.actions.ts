import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import { BoxPartenzaHover } from '../../../composizione-partenza/interface/composizione/box-partenza-hover-interface';
import { FiltriComposizione } from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';

export class GetListaComposizioneVeloce {
    static readonly type = '[ComposizioneVeloce] Get PreAccoppiati';

    constructor(public options?: { filtri?: FiltriComposizione, page?: number }) {
    }
}

export class SetListaPreaccoppiati {
    static readonly type = '[ComposizioneVeloce] Set PreAccoppiati';

    constructor(public preAccoppiati: BoxPartenza[]) {
    }
}

export class ClearPreaccoppiati {
    static readonly type = '[ComposizioneVeloce] Clear PreAccoppiati';
}

export class SelectPreAccoppiatoComposizione {
    static readonly type = '[PreAccoppiati] Select PreAccoppiato Composizione';

    constructor(public preAcc: BoxPartenza) {
    }
}

export class UnselectPreAccoppiatoComposizione {
    static readonly type = '[PreAccoppiati] Unselect PreAccoppiato Composizione';

    constructor(public preAcc: BoxPartenza) {
    }
}

export class ClearPreAccoppiatiSelezionatiComposizione {
    static readonly type = '[PreAccoppiati] Clear PreAccoppiati Selezionati Composizione';
}

export class UpdateMezzoPreAccoppiatoComposizione {
    static readonly type = '[PreAccoppiati] Update Mezzo BoxPartenza Composizione';

    constructor(public codiceMezzo: string) {
    }
}

export class ClearComposizioneVeloce {
    static readonly type = '[PreAccoppiati] Clear PreAccoppiati';
}

export class SetIdPreAccoppiatiOccupati {
    static readonly type = '[ComposizioneVeloce] Set Id PreAccoppiati Occupati';

    constructor(public idPreaccoppiatiOccupati: string[]) {
    }
}

export class HoverInPreAccoppiatoComposizione {
    static readonly type = '[PreAccoppiati] Hover In PreAccoppiato Composizione';

    constructor(public idBoxPartenzaHover: BoxPartenzaHover) {
    }
}

export class HoverOutPreAccoppiatoComposizione {
    static readonly type = '[PreAccoppiati] Hover Out PreAccoppiato Composizione';
}
