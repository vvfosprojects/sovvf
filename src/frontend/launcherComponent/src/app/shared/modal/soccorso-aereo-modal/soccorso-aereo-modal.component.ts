import { Component, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngxs/store';
import {ComposizioneSoccorsoAereoState} from '../../../features/home/store/states/composizione-partenza/composizione-soccorso-aereo.state';
import {makeCopy} from '../../helper/function';


@Component({
  selector: 'app-soccorso-aereo-modal',
  templateUrl: './soccorso-aereo-modal.component.html',
  styleUrls: ['./soccorso-aereo-modal.component.css']
})

export class SoccorsoAereoModalComponent implements OnDestroy {

  subscription: Subscription = new Subscription();
  azioniRichiesta: [{
    categoryCode: null,
    categoryName: null,
    checked: boolean,
  }];

  constructor(private modal: NgbActiveModal, private store: Store) {
    this.azioniRichiesta = makeCopy(store.selectSnapshot(ComposizioneSoccorsoAereoState.azioniRichieste));
    this.azioniRichiesta.forEach(x => x.checked = false);
    console.log('*** LISTA AZIONI RICHIESTA ', this.azioniRichiesta);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCheck(i: number): void {
    this.azioniRichiesta[i].checked = !this.azioniRichiesta[i].checked;
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    if (closeRes === 'ok') {
      this.modal.close({
        status: 'ok',
        result: {},
      });
    } else {
      this.modal.close({ status: 'ko'});
    }
  }

}
