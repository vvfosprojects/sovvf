import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RichiestaSelezionataService } from '../../lista-richieste-service/richiesta-selezionata-service/richiesta-selezionata-service.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

@Component({
  selector: 'app-richiesta-selezionata',
  templateUrl: './richiesta-selezionata.component.html',
  styleUrls: ['./richiesta-selezionata.component.css']
})
export class RichiestaSelezionataComponent implements OnInit, OnDestroy {
  @Input() richieste: SintesiRichiesta[];
  richiestaSelezionata: SintesiRichiesta;
  subscription: Subscription;

  constructor(private richiestaSelezionataS: RichiestaSelezionataService) { }

  ngOnInit() {
    this.subscription = this.richiestaSelezionataS.getRichiesta().subscribe(richiesta => {
      this.setSelezionata(richiesta);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setSelezionata(id_rSelezionata) {
    if (typeof id_rSelezionata === 'undefined') {
      this.richiestaSelezionata = null;
    } else {
      this.richieste.forEach(richiesta => {
        if (richiesta.id === id_rSelezionata) {
          this.richiestaSelezionata = richiesta;
        }
      });
    }
  }
}
