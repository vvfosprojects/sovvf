import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { EventiRichiestaState } from '../store/states/eventi/eventi-richiesta.state';
import { Observable, Subscription } from 'rxjs';
import { EventoRichiesta } from '../../../shared/model/evento-richiesta.model';
import { FiltroTargaMezzo } from './interface/filtro-targa-mezzo.interface';
import { SetFiltroTargaMezzo, ToggleIconeNomeClasseEvento } from '../store/actions/eventi/eventi-richiesta.actions';
import { LoadingState } from '../../../shared/store/states/loading/loading.state';
import { ImpostazioniState } from '../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-eventi-richiesta',
    templateUrl: './eventi-richiesta.component.html',
    styleUrls: ['./eventi-richiesta.component.css']
})
export class EventiRichiestaComponent implements OnInit, OnDestroy {

    @Select(EventiRichiestaState.listaEventiFiltrata) eventiRichiesta$: Observable<EventoRichiesta[]>;
    @Select(EventiRichiestaState.listaTargaMezzo) listaTargaMezzo$: Observable<FiltroTargaMezzo[]>;
    @Select(EventiRichiestaState.codiceRichiesta) codiceRichiesta$: Observable<string>;
    @Select(EventiRichiestaState.targheSelezionate) targheSelezionate$: Observable<string[]>;
    @Select(EventiRichiestaState.visualizzazioneIconeNomeClasseEvento) visualizzazioneIconeNomeClasseEvento$: Observable<boolean>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    @Select(ImpostazioniState.visualizzazioneTestualeEventi) visualizzazioneTestualeEventi$: Observable<boolean>;

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getVisualizzazioneTestualeEventi();
        this.getNightMode();
    }

    ngOnInit(): void {
        console.log('Componente Eventi Richiesta Creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Eventi Richiesta Distrutto');
        this.subscription.unsubscribe();
    }

    getNightMode(): void {
      this.subscription.add(
        this.nightMode$.subscribe((nightMode: boolean) => {
          this.nightMode = nightMode;
        })
      );
    }

    onNightMode(): string {
      let value = '';
      if (!this.nightMode) {
        value = '';
      } else if (this.nightMode) {
        value = 'moon-text moon-mode';
      }
      return value;
    }

    onSelezioneTarga($event): void {
        this.store.dispatch(new SetFiltroTargaMezzo($event));
    }

    toggleIconeNomeClasseEvento(): void {
        this.store.dispatch(new ToggleIconeNomeClasseEvento());
    }

    getVisualizzazioneTestualeEventi(): void {
        this.subscription.add(
            this.visualizzazioneTestualeEventi$.subscribe((value: boolean) => {
                if (value) {
                    this.store.dispatch(new ToggleIconeNomeClasseEvento());
                }
            })
        );
    }
}
