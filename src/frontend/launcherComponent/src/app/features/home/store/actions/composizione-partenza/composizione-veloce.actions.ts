import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { IdPreaccoppiati } from '../../../composizione-partenza/interface/id-preaccoppiati-interface';

export class GetPreAccoppiati {
    static readonly type = '[ComposizioneVeloce] Get PreAccoppiati';

    constructor(public filtri?: any) {
    }
}

export class SetPreaccoppiati {
    static readonly type = '[ComposizioneVeloce] Set PreAccoppiati';

    constructor(public boxPartenza: BoxPartenza[]) {
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

export class UpdateMezzoPreAccoppiatoComposizione {
    static readonly type = '[PreAccoppiati] Update Mezzo BoxPartenza Composizione';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class ClearComposizioneVeloce {
    static readonly type = '[PreAccoppiati] Clear PreAccoppiati';
}

export class GetListaIdPreAccoppiati {
    static readonly type = '[ComposizioneVeloce] Get Id PreAccoppiati';
}

export class SetListaIdPreAccoppiati {
    static readonly type = '[ComposizioneVeloce] Set Id PreAccoppiati';

    constructor(public idPreaccoppiati: IdPreaccoppiati[]) {
    }
}
