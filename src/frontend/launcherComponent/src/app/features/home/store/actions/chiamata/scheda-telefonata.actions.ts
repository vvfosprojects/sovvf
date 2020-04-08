import { SchedaTelefonataInterface } from '../../../../../shared/interface/scheda-telefonata.interface';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../../../shared/enum/azione-chiamata.enum';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';

export class ReducerSchedaTelefonata {
    static readonly type = '[SchedaTelefonata] Reduce completato';

    constructor(public schedaTelefonata: SchedaTelefonataInterface) {
    }
}

export class MarkerChiamata {
    static readonly type = '[SchedaTelefonata] Set chiamata Marker';

    constructor(public marker: ChiamataMarker) {
    }
}

export class ClearMarkerChiamata {
    static readonly type = '[SchedaTelefonata] Clear chiamata Marker';
}

export class ClearChiamata {
    static readonly type = '[SchedaTelefonata] Clear chiamata';
}

export class InsertChiamata {
    static readonly type = '[SchedaTelefonata] Insert chiamata';

    constructor(public nuovaRichiesta: SintesiRichiesta, public azioneChiamata: AzioneChiamataEnum) {
    }
}

export class InsertChiamataSuccess {
    static readonly type = '[SchedaTelefonata] Insert chiamata success';

    constructor(public nuovaRichiesta: SintesiRichiesta) {
    }
}


export class CestinaChiamata {
    static readonly type = '[SchedaTelefonata] Cestina chiamata';

}

export class ResetChiamata {
    static readonly type = '[SchedaTelefonata] Reset chiamata';

}

export class StartChiamata {
    static readonly type = '[SchedaTelefonata] Start Chiamata';
}

export class StartLoadingNuovaChiamata {
    static readonly type = '[SchedaTelefonata] Start Loading Nuova Chiamata';
}

export class StopLoadingNuovaChiamata {
    static readonly type = '[SchedaTelefonata] Stop Loading Nuova Chiamata';
}
