import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { InsertChiamataSuccess } from '../../../features/home/store/actions/chiamata/scheda-telefonata.actions';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { makeIDChiamata } from '../../../shared/helper/function';
import { RichiesteState } from '../../../features/home/store/states/richieste/richieste.state';
import { InsertRichiestaMarker } from '../../../features/home/store/actions/maps/richieste-markers.actions';
import { RichiestaMarker } from '../../../features/home/maps/maps-model/richiesta-marker.model';

@Injectable()
export class ChiamataServiceFake {

    constructor(private store: Store) {
    }

    insertChiamata(chiamata: SintesiRichiesta): Observable<any> {
        const idRichieste: string[] = [];
        this.store.selectSnapshot(RichiesteState.richieste).forEach(
            richiesta => {
                idRichieste.push(richiesta.id);
            }
        );
        let id = makeIDChiamata();
        while (idRichieste.includes(id)) {
            console.log(`idRichiesta già presente: ${id}`);
            id = makeIDChiamata();
        }
        console.log(`Generato nuovo id: ${id}`);
        chiamata.prioritaRichiesta = 3;
        chiamata.codice = id;
        chiamata.id = id;
        const chiamataMarker = new RichiestaMarker(id,
            chiamata.codice,
            chiamata.codiceRichiesta,
            chiamata.localita, chiamata.tipologie,
            chiamata.localita.indirizzo,
            chiamata.prioritaRichiesta,
            chiamata.stato,
            false,
            false);
        setTimeout( () => {
            this.store.dispatch([
                new InsertChiamataSuccess(chiamata),
                new InsertRichiestaMarker(chiamataMarker)
            ]);
        }, 1000);
        return of(id);
    }

}
