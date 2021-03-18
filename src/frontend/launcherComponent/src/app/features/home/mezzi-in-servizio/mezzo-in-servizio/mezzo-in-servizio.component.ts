import { Component, EventEmitter, Input, Output } from '@angular/core';
import { statoMezzoBorderClass } from '../../../../shared/helper/function';
import { MezzoInServizio } from '../../../../shared/interface/mezzo-in-servizio.interface';
import { VisualizzaListaSquadrePartenza } from '../../store/actions/richieste/richieste.actions';
import { Store } from '@ngxs/store';
import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';

@Component({
    selector: 'app-mezzo-in-servizio',
    templateUrl: './mezzo-in-servizio.component.html',
    styleUrls: ['./mezzo-in-servizio.component.css']
})
export class MezzoInServizioComponent {

    @Input() mezzoInServizio: MezzoInServizio;
    @Input() idMezzoInServizioHover: string;
    @Input() idMezzoInServizioSelezionato: string;
    @Input() loading: string;

    @Output() hoverIn: EventEmitter<any> = new EventEmitter<any>();
    @Output() hoverOut: EventEmitter<any> = new EventEmitter<any>();
    @Output() selezionato: EventEmitter<any> = new EventEmitter<any>();
    @Output() dettaglioRichiesta: EventEmitter<any> = new EventEmitter<any>();
    @Output() visualizzaEventiRichiesta: EventEmitter<any> = new EventEmitter<any>();
    @Output() actionMezzo: EventEmitter<any> = new EventEmitter<any>();

    StatoMezzo = StatoMezzo;
    mostraIndicatori = false;
    loadingArray: any[] = [];

    constructor(private store: Store) {
    }

    // tslint:disable-next-line:use-lifecycle-interface
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
        this.store.dispatch(new VisualizzaListaSquadrePartenza(listaSquadre));
    }

    cardClasses(stato: StatoMezzo, idMezzo: string): string {
        let returnClass = statoMezzoBorderClass(stato);
        if (this.idMezzoInServizioHover === idMezzo) {
            returnClass += ' bg-light';
        }
        if (this.idMezzoInServizioSelezionato === idMezzo) {
            returnClass += ' bg-light';
        }
        return returnClass;
    }
}
