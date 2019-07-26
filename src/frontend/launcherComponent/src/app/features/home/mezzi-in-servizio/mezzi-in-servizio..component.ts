import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ToggleMezziInServizio } from '../store/actions/view/view.actions';
import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { GetMezziInServizio } from '../store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { Observable } from 'rxjs';
import { MezzoActionInterface } from 'src/app/shared/interface/mezzo-action.interface';
import { ActionMezzo } from '../store/actions/richieste/richieste.actions';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({
  selector: 'app-mezzi-in-servizio',
  templateUrl: './mezzi-in-servizio.component.html',
  styleUrls: ['./mezzi-in-servizio.component.css']
})
export class MezziInServizioComponent implements OnInit {

  @Select(MezziInServizioState.mezziInServizio) mezziInServizio$: Observable<Mezzo[]>;
  mezziInServizio: Mezzo[];

  @Select(RichiesteState.richieste) richieste$: Observable<SintesiRichiesta[]>;
  richieste: SintesiRichiesta[];

  constructor(private store: Store) {
    this.store.dispatch(new GetMezziInServizio());
    this.mezziInServizio$.subscribe((mezzi: Mezzo[]) => {
      this.mezziInServizio = mezzi;
    });

    this.richieste$.subscribe((richieste: any) => {
      this.richieste = richieste;
    });
  }

  ngOnInit() {
  }

  onActionMezzo(mezzo: Mezzo, mezzoAction: MezzoActionInterface) {
    const richiesta = this.richieste.filter(x => x.codice === mezzo.idRichiesta)[0];
    mezzoAction.richiesta = richiesta ? richiesta : null;
    mezzoAction.listaMezzi = true;
    this.store.dispatch(new ActionMezzo(mezzoAction));
  }

  tornaIndietro() {
    this.store.dispatch(new ToggleMezziInServizio());
  }

}
