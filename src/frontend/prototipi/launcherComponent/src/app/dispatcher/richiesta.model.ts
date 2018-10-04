import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { RichiestaMarker } from '../maps/maps-model/richiesta-marker.model';

export class Richiesta {
    constructor(
        public sRichiesta: SintesiRichiesta,
        public mRichiesta: RichiestaMarker
    ) { }
}
