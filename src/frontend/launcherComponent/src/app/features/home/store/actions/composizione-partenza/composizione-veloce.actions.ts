import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

export class GetListaComposizioneVeloce {
    static readonly type = '[PreAccoppiati] Get Lista PreAccoppiati';

    constructor(public filtri?: any) {
    }
}

export class SetListaComposizioneVeloce {
    static readonly type = '[PreAccoppiati] Set Lista PreAccoppiati';

    constructor(public boxPartenza: BoxPartenza[]) {
    }
}

export class ClearListaComposizioneVeloce {
    static readonly type = '[PreAccoppiati] Clear Lista PreAccoppiati';
}
