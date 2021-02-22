import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import {Select} from '@ngxs/store';
import {ImpostazioniState} from '../../store/states/impostazioni/impostazioni.state';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-action-richiesta-modal',
    templateUrl: './action-richiesta-modal.component.html',
    styleUrls: ['./action-richiesta-modal.component.css']
})
export class ActionRichiestaModalComponent implements OnInit, OnDestroy {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    @Input() icona: any;
    @Input() titolo: string;
    @Input() messaggio: string;
    @Input() messaggioAttenzione: string;
    @Input() bottoni: any[];

    actionRichiestaForm: FormGroup;
    subscription: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder) {
        this.actionRichiestaForm = this.formBuilder.group({
            note: new FormControl()
        });
        this.getNightMode();
    }

    get f(): any {
        return this.actionRichiestaForm.controls;
    }

    ngOnInit(): void {
        this.actionRichiestaForm = this.formBuilder.group({
            note: ['']
        });
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

    close(esito: string): void {
        const obj = {
            esito: esito,
            note: this.f.note.value ? this.f.note.value : null
        };
        this.modal.close(obj);
    }
}
