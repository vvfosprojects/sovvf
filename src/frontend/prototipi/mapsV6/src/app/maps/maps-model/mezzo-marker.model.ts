import {Squadra} from '../../shared/model/squadra.model';
import {Mezzo} from '../../shared/model/mezzo.model';
import {Coordinate} from '../../shared/model/coordinate.model';

export class MezzoMarker {
    constructor(
        /* La stringa dell'indirizzo e le relative coordinate */
        public coordinate: Coordinate,
        /* Contiene le proprietà del mezzo */
        public mezzo: Mezzo,
        /* id della richiesta a cui è associato il mezzo */
        public id_richiesta?: string,
        /* Le squadre presenti sul mezzo */
        public squadre?: Squadra[],
        /* Contiene la descrizione della label da mostrare */
        public label?: string
    ) {
    }

    getCoordinate() {
        return new Coordinate(this.coordinate.latitudine, this.coordinate.longitudine);
    }

    inSoccorso() {
        return !!this.id_richiesta;
    }

    getStato() {
        return this.mezzo.stato;
    }
}
