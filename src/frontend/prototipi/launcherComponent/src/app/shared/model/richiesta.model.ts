import { SintesiRichiesta } from './sintesi-richiesta.model';
import { RichiestaMarker } from '../../maps/maps-model/richiesta-marker.model';

export class Richiesta {
    constructor(
        /* Lista di SintesiRichiesta[] */
        public sRichiesta: SintesiRichiesta,
        /* Lista di RichiestaMarker[] */
        public mRichiesta: RichiestaMarker
    ) { }
}
