import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EventoRichiesta } from '../../../../shared/model/evento-richiesta.model';
import * as moment from 'moment';
import { EventiRichiestaState } from '../../store/states/eventi/eventi-richiesta.state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { makeCopy } from 'src/app/shared/helper/function';
import { SetRicercaTargaMezzo } from '../../store/actions/eventi/eventi-richiesta.actions';

@Component({
    selector: 'app-lista-eventi-richiesta',
    templateUrl: './lista-eventi-richiesta.component.html',
    styleUrls: ['./lista-eventi-richiesta.component.css']
})
export class ListaEventiRichiestaComponent implements OnInit, OnChanges {
    @Input() elencoEventi: EventoRichiesta[];

    @Select(EventiRichiestaState.filtroTargaMezzo) filtroTargaMezzo$: Observable<any>;
    filtroTargaMezzo: any;

    subscription: Subscription = new Subscription();

    istanteEventoPrecedente: Date; // erano private implementare setter and getter
    istantePrimoEvento: Date; // erano private implementare setter and getter

    constructor(private store: Store) {
    }

    ngOnInit() {
        if (this.istantePrimoEvento == null) {
            // this.setIstantePrimoEvento(this.elencoEventi[0].istanteEvento);
            this.setIstantePrimoEvento(moment().toDate());
        }
        this.subscription.add(
            this.filtroTargaMezzo$.subscribe((filtroTargaMezzo: any) => {
                this.filtroTargaMezzo = makeCopy(filtroTargaMezzo);
            })
        );
    }


    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes) {
                const change = changes[propName];
                const curVal = JSON.stringify(change.currentValue);
                const prevVal = JSON.stringify(change.previousValue);

                // console.log('ngOnChanges Felix');
                // console.log(propName);
                // console.log(curVal);
                // console.log(prevVal);

                if (propName === 'istanteEvento') {
                    // console.log('ngOnChanges Felix istanteEvento');
                    // this.setIstanteEventoPrecedente(new Date(curVal));
                }
            }
        }
    }

    /*
     private setIstanteEventoPrecedente(p: Date) : void {
      this.istanteEventoPrecedente = p;
    }
    */
    private setIstanteEventoPrecedente(i: number): Date {
        // console.log('setIstanteEventoPrecedente');
        if (i > 0) {
            this.istanteEventoPrecedente = this.elencoEventi[i - 1].istanteEvento;
            // console.log('ok');
            // console.log(this.istanteEventoPrecedente);
        } else {
            this.istanteEventoPrecedente = this.elencoEventi[0].istanteEvento;
        }
        return this.istanteEventoPrecedente;
    }

    private setIstantePrimoEvento(p: Date): void {
        this.istantePrimoEvento = p;
    }

    setRicercaTargaMezzo(targa: string) {
        if (targa) {
            this.store.dispatch(new SetRicercaTargaMezzo({ targa: targa }));
        } else {
            console.warn('Targa mezzo non presente, impossibile ricercare!');
        }
    }
}
