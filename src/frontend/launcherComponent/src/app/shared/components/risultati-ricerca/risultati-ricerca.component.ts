import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetRicercaFilterbar } from '../../../features/home/store/actions/filterbar/ricerca-richieste.actions';
import { SetRicercaAreaDocumentale } from '../../../features/area-documentale/store/actions/ricerca-area-documentale/ricerca-area-documentale.actions';
import { SetRicercaPos } from '../../../features/pos/store/actions/ricerca-pos/ricerca-pos.actions';
import { SetRicercaRubrica } from '../../../features/rubrica/store/actions/ricerca-rubrica/ricerca-rubrica.actions';
import { SetRicercaRubricaPersonale } from '../../../features/rubrica-personale/store/actions/ricerca-rubrica-personale/ricerca-rubrica-personale.actions';
import { SetRicercaUtenti } from '../../../features/gestione-utenti/store/actions/ricerca-utenti/ricerca-utenti.actons';
import { SetRicercaTrasferimentoChiamata } from '../../../features/trasferimento-chiamata/store/actions/ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.actions';
import { SetRicercaDettagliTipologie } from '../../store/actions/dettagli-tipologie/dettagli-tipologie.actions';

@Component({
    selector: 'app-risultati-ricerca',
    templateUrl: './risultati-ricerca.component.html',
    styleUrls: ['./risultati-ricerca.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RisultatiRicercaComponent {

    @Input() ricerca: string;

    constructor(private store: Store) {
    }

    resetRicerca(): void {
        this.store.dispatch([
            new SetRicercaFilterbar(''),
            new SetRicercaAreaDocumentale(''),
            new SetRicercaPos(''),
            new SetRicercaRubrica(''),
            new SetRicercaRubricaPersonale(''),
            new SetRicercaUtenti(''),
            new SetRicercaTrasferimentoChiamata(''),
            new SetRicercaDettagliTipologie('')
        ]);
    }

}
