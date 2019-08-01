import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { makeCopy } from 'src/app/shared/helper/function';
import { Store, Select } from '@ngxs/store';
import { SetRicercaTargaMezzo } from '../../store/actions/eventi/eventi-richiesta.actions';
import { EventiRichiestaState } from '../../store/states/eventi/eventi-richiesta.state';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-filtri-eventi-richiesta',
  templateUrl: './filtri-eventi-richiesta.component.html',
  styleUrls: ['./filtri-eventi-richiesta.component.css']
})
export class FiltriEventiRichiestaComponent implements OnInit, OnDestroy {

  @Input() idRichiesta: string;

  @Select(EventiRichiestaState.filtroTargaMezzo) filtroTargaMezzo$: Observable<any>;
  filtroTargaMezzo = { targa: '' };

  subscription: Subscription = new Subscription();

  constructor(private store: Store) { }

  ngOnInit() {
    this.subscription.add(
      this.filtroTargaMezzo$.subscribe((filtroTargaMezzo: any) => {
        this.filtroTargaMezzo = makeCopy(filtroTargaMezzo);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch() {
    this.store.dispatch(new SetRicercaTargaMezzo(makeCopy(this.filtroTargaMezzo)));
    // this.ricercaTargaMezzo.emit(makeCopy(this.filtroTargaMezzo));
  }
}
