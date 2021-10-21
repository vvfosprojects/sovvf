import { SchedaTelefonataInterface } from '../../../../../shared/interface/scheda-telefonata.interface';
import { ChiamataMarker } from '../../../../maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../../../shared/enum/azione-chiamata.enum';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { Sede } from '../../../../../shared/model/sede.model';

export class ReducerSchedaTelefonata {
    static readonly type = '[SchedaTelefonata] Reduce completato';

    constructor(public schedaTelefonata: SchedaTelefonataInterface, public options?: { urgente?: boolean, fromMappa?: boolean }) {
    }
}

export class MarkerChiamata {
    static readonly type = '[SchedaTelefonata] Set chiamata Marker';

    constructor(public marker: ChiamataMarker, public codCompetenze: string[]) {
    }
}

export class SetCompetenze {
    static readonly type = '[SchedaTelefonata] Set Competenze';

    constructor(public coordinate: Coordinate, public indirizzo: string, public markerChiamata: ChiamataMarker) {
    }
}

export class SetCountInterventiProssimita {
    static readonly type = '[SchedaTelefonata] Set Count Interventi Vicinanze';

    constructor(public indirizzo: string, public coordinate: Coordinate, public codCompetenze: string[]) {
    }
}

export class SetInterventiProssimita {
    static readonly type = '[SchedaTelefonata] Set Interventi Vicinanze';

    constructor(public indirizzo: string, public coordinate: Coordinate, public codCompetenze: string[]) {
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

    constructor(public azioneChiamata: AzioneChiamataEnum, public options?: { urgente?: boolean, fromMappa?: boolean }) {
    }
}

export class InsertChiamataSuccess {
    static readonly type = '[SchedaTelefonata] Insert chiamata success';

    constructor(public nuovaRichiesta: SintesiRichiesta, public options?: { trasferimento?: boolean }) {
    }
}


export class AnnullaChiamata {
    static readonly type = '[SchedaTelefonata] Annulla chiamata';

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

export class ClearIndirizzo {
    static readonly type = '[SchedaTelefonata] Clear Indirizzo';
}

export class StartLoadingNuovaChiamata {
    static readonly type = '[SchedaTelefonata] Start Loading Nuova Chiamata';
}

export class StopLoadingNuovaChiamata {
    static readonly type = '[SchedaTelefonata] Stop Loading Nuova Chiamata';
}
