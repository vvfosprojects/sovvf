import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MezzoInServizio } from '../../interface/mezzo-in-servizio.interface';
import { VisualizzaListaSquadrePartenza } from '../../../features/home/store/actions/richieste/richieste.actions';
import { Store } from '@ngxs/store';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { statoMezzoBorderClass, statoMezzoColor } from '../../helper/function-mezzo';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { HelperSintesiRichiesta } from '../../../features/home/richieste/helper/_helper-sintesi-richiesta';

@Component({
    selector: 'app-mezzo-in-servizio',
    templateUrl: './mezzo-in-servizio.component.html',
    styleUrls: ['./mezzo-in-servizio.component.css']
})
export class MezzoInServizioComponent implements OnChanges {

    @Input() mezzoInServizio: MezzoInServizio;
    @Input() idMezzoInServizioHover: string;
    @Input() idMezzoInServizioSelezionato: string;
    @Input() richiesta: SintesiRichiesta;
    @Input() loading: string;
    @Input() nightMode: boolean;
    @Input() colIndirizzoRichiesta = '3';
    @Input() truncateLenghtIndirizzoRichiesta = 30;
    @Input() colInfoRichiesta = '3';
    @Input() hideCodRichiesta: boolean;
    @Input() hideTextButtonEventi: boolean;
    @Input() hideDistaccamento: boolean;
    @Input() showTipologiaRichiesta: boolean;
    @Input() showSelectButton: boolean;

    @Output() hoverIn: EventEmitter<any> = new EventEmitter<any>();
    @Output() hoverOut: EventEmitter<any> = new EventEmitter<any>();
    @Output() selezionato: EventEmitter<any> = new EventEmitter<any>();
    @Output() sgancia: EventEmitter<any> = new EventEmitter<any>();
    @Output() dettaglioRichiesta: EventEmitter<any> = new EventEmitter<any>();
    @Output() visualizzaEventiRichiesta: EventEmitter<any> = new EventEmitter<any>();
    @Output() actionMezzo: EventEmitter<any> = new EventEmitter<any>();

    StatoMezzo = StatoMezzo;
    mostraIndicatori = false;
    loadingArray: any[] = [];

    methods = new HelperSintesiRichiesta();

    constructor(private store: Store) {
    }

    ngOnChanges(): void {
        if (this.loading && !this.loadingArray.includes(this.loading)) {
            this.loadingArray.push(this.loading);
        } else if (!this.loading) {
            this.loadingArray.shift();
        }
    }

    onListaSquadrePartenza(): void {
        const listaSquadre = {
            squadre: this.mezzoInServizio.squadre
        };
        this.store.dispatch(new VisualizzaListaSquadrePartenza(this.mezzoInServizio.mezzo.mezzo.codice, listaSquadre));
    }

    cardClasses(stato: StatoMezzo): string {
        return statoMezzoBorderClass(stato);
    }

    statoMezzoColor(stato: StatoMezzo): string {
        return statoMezzoColor(stato);
    }

    onSelect(mezzo: MezzoInServizio): void {
        this.sgancia.emit(mezzo);
    }
}
