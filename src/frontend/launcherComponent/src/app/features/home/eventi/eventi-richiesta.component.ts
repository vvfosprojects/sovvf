import { Component, OnDestroy, OnInit, isDevMode } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { EventiRichiestaState } from '../store/states/eventi/eventi-richiesta.state';
import { Observable } from 'rxjs';
import { EventoRichiesta } from '../../../shared/model/evento-richiesta.model';
import { FiltroTargaMezzo } from './filtro-targa-mezzo.interface';
import { SetFiltroTargaMezzo, ToggleIconeNomeClasseEvento } from '../store/actions/eventi/eventi-richiesta.actions';

@Component({
  selector: 'app-eventi-richiesta',
  templateUrl: './eventi-richiesta.component.html',
  styleUrls: ['./eventi-richiesta.component.css']
})
export class EventiRichiestaComponent implements OnInit, OnDestroy {

  @Select(EventiRichiestaState.listaEventiFiltrata) eventiRichiesta$: Observable<EventoRichiesta[]>;
  @Select(EventiRichiestaState.listaTargaMezzo) listaTargaMezzo$: Observable<FiltroTargaMezzo[]>;
  @Select(EventiRichiestaState.idRichiesta) idRichiesta$: Observable<string>;
  @Select(EventiRichiestaState.codiceRichiesta) codiceRichiesta$: Observable<string>;
  @Select(EventiRichiestaState.targheSelezionate) targheSelezionate$: Observable<string[]>;
  @Select(EventiRichiestaState.visualizzazioneIconeNomeClasseEvento) visualizzazioneIconeNomeClasseEvento$: Observable<boolean>;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    isDevMode() && console.log('Componente Eventi Richiesta Creato');
  }

  ngOnDestroy(): void {
    isDevMode() && console.log('Componente Eventi Richiesta Distrutto');
  }

  onSelezioneTarga($event) {
    this.store.dispatch(new SetFiltroTargaMezzo($event));
  }

  toggleIconeNomeClasseEvento() {
    this.store.dispatch(new ToggleIconeNomeClasseEvento());
  }
}
