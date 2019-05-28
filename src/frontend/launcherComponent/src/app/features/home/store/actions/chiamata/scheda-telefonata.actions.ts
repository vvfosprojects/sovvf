import { SchedaTelefonataInterface } from '../../../chiamata/model/scheda-telefonata.interface';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../../../shared/enum/azione-chiamata.enum';

export class ReducerSchedaTelefonata {
    static readonly type = '[Scheda Telefonata] Reduce completato';

    constructor(public schedaTelefonata: SchedaTelefonataInterface) {
    }
}

export class MarkerChiamata {
    static readonly type = '[Scheda Telefonata] Set chiamata Marker';

    constructor(public marker: ChiamataMarker) {
    }
}

export class ClearMarkerChiamata {
    static readonly type = '[Scheda Telefonata] Clear chiamata Marker';
}

export class ClearChiamata {
    static readonly type = '[Scheda Telefonata] Clear chiamata';
}

export class InsertChiamata {
    static readonly type = '[Scheda Telefonata] Insert chiamata';

    constructor(public nuovaRichiesta: SintesiRichiesta, public azioneChiamata: AzioneChiamataEnum) {
    }
}

export class InsertChiamataSuccess {
    static readonly type = '[Scheda Telefonata] Insert chiamata success';

    constructor(public nuovaRichiesta: any) {
    }
}


export class CestinaChiamata {
    static readonly type = '[Scheda Telefonata] Cestina chiamata';

}

export class ResetChiamata {
    static readonly type = '[Scheda Telefonata] Reset chiamata';

}

export class StartChiamata {
    static readonly type = '[Scheda Telefonata] Start Chiamata';

}
