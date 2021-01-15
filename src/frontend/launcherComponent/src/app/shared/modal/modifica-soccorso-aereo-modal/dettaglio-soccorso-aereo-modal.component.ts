import { Component, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';


@Component({
  selector: 'app-dettaglio-soccorso-aereo-modal',
  templateUrl: './dettaglio-soccorso-aereo-modal.component.html',
  styleUrls: ['./dettaglio-soccorso-aereo-modal.component.css']
})

export class DettaglioSoccorsoAereoModalComponent implements OnDestroy {

  subscription: Subscription = new Subscription();
  richiesta: SintesiRichiesta;
  showAttivita = true;
  attivita: any[] = [
     {
      stato: 'test1',
      aggiornamento: 'test2',
      nucleo: 'test3',
      velivolo: 'test4',
      categorie: 'test5',
      tempoStimato: 'test6',
      accettazione: 'test7',
      decollo: 'test8',
      arrivo: 'test9',
      rientro: 'test10',
      sede: 'test11'
    },
    {
      stato: 'aaaaa',
      aggiornamento: 'bbbb',
      nucleo: 'cccc',
      velivolo: 'ddddd',
      categorie: 'eeeeee',
      tempoStimato: 'fffff',
      accettazione: 'ggggg',
      decollo: 'hhhhhh',
      arrivo: 'iiiii',
      rientro: 'lllll',
      sede: 'mmmmm'
    },
  ];

  constructor(private modal: NgbActiveModal) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onShowAttivita(): void {
    this.showAttivita = !this.showAttivita;
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    this.modal.close(closeRes);
  }

}
