import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import {
  SetSchedaContattoTelefonata,
  SetSchedaContattoHover,
  ClearSchedaContattoHover, SetSchedaContattoLetta, SetSchedaContattoGestita, GetListaSchedeContatto
} from '../store/actions/schede-contatto/schede-contatto.actions';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { ToggleSchedeContatto, ToggleChiamata } from '../store/actions/view/view.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DettaglioSchedaModalComponent } from './dettaglio-scheda-modal/dettaglio-scheda-modal.component';
import { ContatoriSchedeContatto } from '../../../shared/interface/contatori-schede-contatto.interface';

@Component({
  selector: 'app-schede-contatto',
  templateUrl: './schede-contatto.component.html',
  styleUrls: ['./schede-contatto.component.css']
})
export class SchedeContattoComponent implements OnInit, OnDestroy {


  @Select(SchedeContattoState.schedeContatto) schedeContatto$: Observable<SchedaContatto[]>;
  schedeContatto: SchedaContatto[];
  @Select(SchedeContattoState.schedeContattoCompetenza) schedeContattoCompetenza$: Observable<SchedaContatto[]>;
  schedeContattoCompetenza: SchedaContatto[];
  @Select(SchedeContattoState.schedeContattoConoscenza) schedeContattoConoscenza$: Observable<SchedaContatto[]>;
  schedeContattoConoscenza: SchedaContatto[];
  @Select(SchedeContattoState.schedeContattoDifferibili) schedeContattoDifferibili$: Observable<SchedaContatto[]>;
  schedeContattoDifferibili: SchedaContatto[];
  @Select(SchedeContattoState.codiceSchedaContattoHover) codiceSchedaContattoHover$: Observable<string>;
  codiceSchedaContattoHover: string;
  @Select(SchedeContattoState.contatoriSchedeContatto) contatoriSchedeContatto$: Observable<ContatoriSchedeContatto>;
  contatoriSchedeContatto: ContatoriSchedeContatto;

  subscription: Subscription = new Subscription();

  constructor(private store: Store,
              private modal: NgbModal) {
    this.subscription.add(
      this.schedeContatto$.subscribe((schedeContatto: SchedaContatto[]) => {
        this.schedeContatto = schedeContatto;
      })
    );
    this.subscription.add(
      this.schedeContattoCompetenza$.subscribe((schedeContatto: SchedaContatto[]) => {
        this.schedeContattoCompetenza = schedeContatto;
      })
    );
    this.subscription.add(
      this.schedeContattoConoscenza$.subscribe((schedeContatto: SchedaContatto[]) => {
        this.schedeContattoConoscenza = schedeContatto;
      })
    );
    this.subscription.add(
      this.schedeContattoDifferibili$.subscribe((schedeContatto: SchedaContatto[]) => {
        this.schedeContattoDifferibili = schedeContatto;
      })
    );
    this.subscription.add(
        this.codiceSchedaContattoHover$.subscribe((codiceSchedaContatto: string) => {
          this.codiceSchedaContattoHover = codiceSchedaContatto;
        })
    );
    this.subscription.add(
        this.contatoriSchedeContatto$.subscribe((contaotoriSchede: ContatoriSchedeContatto) => {
          this.contatoriSchedeContatto = contaotoriSchede;
        })
    );
  }

  ngOnInit(): void {
    isDevMode() && console.log('Componente Schede Contatto creato');
    this.store.dispatch(new GetListaSchedeContatto());
  }

  ngOnDestroy(): void {
    isDevMode() && console.log('Componente Schede Contatto distrutto');
  }

  setSchedaContattoLetta(codiceScheda: string, letta: boolean) {
    this.store.dispatch(new SetSchedaContattoLetta(codiceScheda, letta));
  }

  setSchedaContattoGestita(codiceScheda: string, gestita: boolean) {
    this.store.dispatch(new SetSchedaContattoGestita(codiceScheda, gestita));
  }

  setSchedaContattoTelefonata(schedaContatto: SchedaContatto) {
    this.store.dispatch(new SetSchedaContattoTelefonata(schedaContatto));
    this.store.dispatch(new ToggleChiamata());
  }

  dettaglioScheda(scheda: SchedaContatto) {
    const modal = this.modal.open(DettaglioSchedaModalComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
    modal.componentInstance.schedaContatto = scheda;
    this.setSchedaContattoLetta(scheda.codiceScheda, true);
  }

  hoverIn(idSchedaContatto: string) {
    this.store.dispatch(new SetSchedaContattoHover(idSchedaContatto));
  }

  hoverOut() {
    this.store.dispatch(new ClearSchedaContattoHover());
  }

  tornaIndietro() {
    this.store.dispatch(new ToggleSchedeContatto());
  }


}
