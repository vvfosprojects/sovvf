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

  constructor(private modal: NgbActiveModal) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    this.modal.close(closeRes);
  }

}
