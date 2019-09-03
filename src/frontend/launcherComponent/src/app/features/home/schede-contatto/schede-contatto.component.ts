import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GetListaSchedeContatto, SetSchedaContattoTelefonata } from '../store/actions/schede-contatto/schede-contatto.actions';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { ToggleSchedeContatto } from '../store/actions/view/view.actions';

@Component({
  selector: 'app-schede-contatto',
  templateUrl: './schede-contatto.component.html',
  styleUrls: ['./schede-contatto.component.css']
})
export class SchedeContattoComponent implements OnInit {

  @Select(SchedeContattoState.schedeContatto) schedeContatto$: Observable<SchedaContatto[]>;
  schedeContatto: SchedaContatto[];

  subscription: Subscription = new Subscription();

  constructor(private store: Store) { }

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
  }

  tornaIndietro() {
    this.store.dispatch(new ToggleSchedeContatto());
  }
}
