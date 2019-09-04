import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GetListaSchedeContatto, SetSchedaContattoTelefonata, ClearSchedaContattoTelefonata } from '../store/actions/schede-contatto/schede-contatto.actions';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { ToggleSchedeContatto, ToggleChiamata } from '../store/actions/view/view.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DettaglioSchedaModalComponent } from './dettaglio-scheda-modal/dettaglio-scheda-modal.component';

@Component({
  selector: 'app-schede-contatto',
  templateUrl: './schede-contatto.component.html',
  styleUrls: ['./schede-contatto.component.css']
})
export class SchedeContattoComponent implements OnInit {


  @Select(SchedeContattoState.schedeContatto) schedeContatto$: Observable<SchedaContatto[]>;
  schedeContatto: SchedaContatto[];

  subscription: Subscription = new Subscription();

  constructor(private store: Store,
    private modal: NgbModal) { }

  ngOnInit() {
    this.store.dispatch(new GetListaSchedeContatto());
    this.subscription.add(
      this.schedeContatto$.subscribe((schedeContatto: SchedaContatto[]) => {
        this.schedeContatto = schedeContatto;
      })
    );
  }

  setSchedaContattoTelefonata(schedaContatto: SchedaContatto) {
    this.store.dispatch(new SetSchedaContattoTelefonata(schedaContatto));
    this.store.dispatch(new ToggleChiamata());
  }

  dettaglioScheda(scheda: SchedaContatto) {
    // TODO: aprire modale con tutte le info
    const modal = this.modal.open(DettaglioSchedaModalComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
    modal.componentInstance.schedaContatto = scheda;
  }

hoverIn() {
  // TODO: creare logica
}

hoverOut() {
  // TODO: creare logica
}

  tornaIndietro() {
    this.store.dispatch(new ToggleSchedeContatto());
  }
}
