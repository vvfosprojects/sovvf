import {Component, Input, OnDestroy} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Select} from '@ngxs/store';
import {ImpostazioniState} from '../../store/states/impostazioni/impostazioni.state';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnDestroy {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    @Input() icona: any;
    @Input() titolo: string;
    @Input() messaggio: string;
    @Input() messaggioAttenzione: string;
    @Input() bottoni: any[];

    subscription: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal) {
      this.getNightMode();
    }

    ngOnDestroy(): void {
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
}
