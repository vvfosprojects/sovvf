import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

export class GetListaComposizioneVeloce {
    static readonly type = '[ComposizioneVeloce] Get Lista PreAccoppiati';

    constructor(public filtri?: any) {
    }
}

export class SetListaComposizioneVeloce {
    static readonly type = '[ComposizioneVeloce] Set Lista PreAccoppiati';

    constructor(public boxPartenza: BoxPartenza[]) {
    }
}

export class ClearListaComposizioneVeloce {
    static readonly type = '[ComposizioneVeloce] Clear Lista PreAccoppiati';
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

export class UpdateMezzoPreAccoppiatoComposizione {
    static readonly type = '[PreAccoppiati] Update Mezzo BoxPartenza Composizione';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class ClearComposizioneVeloce {
    static readonly type = '[PreAccoppiati] Clear PreAccoppiati';
}
