import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { Utente } from '../../model/utente.model';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { ModificaPartenzaModalState } from '../../store/states/modifica-partenza-modal/modifica-partenza-modal.state';

@Component({
  selector: 'app-modifica-partenza-modal',
  templateUrl: './modifica-partenza-modal.component.html',
  styleUrls: ['./modifica-partenza-modal.component.css']
})
export class ModificaPartenzaModalComponent implements OnInit {

  @Select(AuthState.currentUser) user$: Observable<Utente>;
  user: Utente;
  @Select(ModificaPartenzaModalState.formValid) formValid$: Observable<boolean>;
  formValid: boolean;

  operatore: string;

  modificaPartenzaForm: FormGroup;
  submitted: boolean;

  subscription: Subscription = new Subscription();
  
  constructor(private store: Store,
              private modal: NgbActiveModal,
              private fb: FormBuilder) { 
      this.initForm();
      this.inizializzaUser();
  }

  ngOnInit() {
  }

  initForm() {
    this.modificaPartenzaForm = new FormGroup({
      nuovoMezzo: new FormControl(),
      operatore: new FormControl(),
    });
    this.modificaPartenzaForm = this.fb.group({
      nuovoMezzo: [null, Validators.required],
      operatore: [null, Validators.required],
    });
    this.f.operatore.disable();
  }

  get f() {
      return this.modificaPartenzaForm.controls;
  }

  ngOnDestroy(): void {
    this.modificaPartenzaForm.reset();
    this.subscription.unsubscribe();
  }

  
  getFormValid() {
      this.subscription.add(
          this.formValid$.subscribe((valid: boolean) => {
              this.formValid = valid;
          })
      );
  }
  

  getTitle(): string {
      let title = 'Modifica Partenza';
      return title;
  }

  inizializzaUser() {
    this.subscription.add(
        this.user$.subscribe((user: Utente) => {
            console.log('inizializzaUser', user);
            this.store.dispatch(
                new UpdateFormValue({
                    path: 'modificaPartenzaModal.modificaPartenzaForm',
                    value: {
                        operatore: user.nome + ' ' + user.cognome
                    }
                })
            );
        })
    );
  }

  onConferma() {
  this.submitted = true;

  if (!this.modificaPartenzaForm.valid) {
      return;
  }

  this.modal.close({ success: true, result: this.modificaPartenzaForm.value });
  }

  onDismiss(): void {
    this.modal.dismiss('ko');
  }

  closeModal(type: string) {
    this.modal.close(type);
  }

}
