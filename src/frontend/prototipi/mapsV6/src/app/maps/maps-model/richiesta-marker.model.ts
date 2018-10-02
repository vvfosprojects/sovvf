import {Localita} from '../../shared/model/localita.model';
import {Tipologia} from '../../shared/model/tipologia.model';
import {Coordinate} from '../../shared/model/coordinate.model';

export class RichiestaMarker {
    constructor(
        /* id */
        public id_richiesta: string,
        /* La stringa dell'indirizzo e le relative coordinate */
        public localita: Localita,
        /* Id del tipo tipologia */
        public tipologia: Tipologia[],
        /* Contiene la descrizione della label da mostrare */
        public label: string,
        /* Determina la rilevanza del marcatore */
        public rilevanza: boolean,
        /* Determina la priorità del marcatore per scegliere il colore del marcatore
        Es: Grave -> Marcatore rosso  */
        public priorita: number,
        /* Determina lo stato della richiesta */
        public stato: string
    ) {
    }

    getCoordinate() {
        return new Coordinate(this.localita.coordinate.latitudine, this.localita.coordinate.longitudine);
    }
}
