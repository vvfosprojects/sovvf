import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrasferimentoChiamataModalState } from '../../store/states/trasferimento-chiamata-modal/trasferimento-chiamata-modal.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { SediTreeviewState } from '../../store/states/sedi-treeview/sedi-treeview.state';
import { TreeviewSelezione } from '../../model/treeview-selezione.model';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { Utente } from '../../model/utente.model';
import { GetRichiesteTrasferibili } from '../../store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { findItem } from '../../store/states/sedi-treeview/sedi-treeview.helper';
import { oneElementLengthArray } from '../../helper/validators-custom';
import {ImpostazioniState} from '../../store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-trasferimento-chiamata-modal',
    templateUrl: './trasferimento-chiamata-modal.component.html',
    styleUrls: ['./trasferimento-chiamata-modal.component.css']
})
export class TrasferimentoChiamataModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(AuthState.currentUser) user$: Observable<Utente>;
    user: Utente;
    @Select(TrasferimentoChiamataModalState.codiciRichiesteTrasferibili) codiciRichiesteTrasferibili$: Observable<string[]>;
    @Select(TrasferimentoChiamataModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(TrasferimentoChiamataModalState.sedeSelezionata) sediSelezionate$: Observable<TreeviewSelezione[]>;
    sediSelezionate: string;
    @Select(SediTreeviewState.listeSediNavbar) listeSediNavbar$: Observable<TreeItem>;
    listeSediNavbar: TreeviewItem[];
    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    operatore: string;
    codRichiesta: string;

    trasferimentoChiamataForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
        this.inizializzaSediTreeview();
        this.getSediSelezionate();
        this.inizializzaUser();
        this.getNightMode();
    }

    ngOnInit(): void {
        if (!this.codRichiesta) {
            this.getCodiciRichiesteTrasferibili();
        } else {
            this.f.codiceRichiesta.patchValue(this.codRichiesta);
            this.f.codiceRichiesta.disable();
        }
    }

    initForm(): void {
        this.trasferimentoChiamataForm = new FormGroup({
            codiceRichiesta: new FormControl(),
            operatore: new FormControl(),
            sedeA: new FormControl()
        });
        this.trasferimentoChiamataForm = this.fb.group({
            codiceRichiesta: [null, Validators.required],
            operatore: [null, Validators.required],
            sedeA: [null, oneElementLengthArray(1)]
        });
        this.f.operatore.disable();
    }

    get f(): any {
        return this.trasferimentoChiamataForm.controls;
    }

    ngOnDestroy(): void {
        this.trasferimentoChiamataForm.reset();
        this.subscription.unsubscribe();
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
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

    getTitle(): string {
        let title = 'Trasferimento Chiamata';
        if (this.codRichiesta) {
            title = 'Trasferisci la Chiamata ' + this.codRichiesta;
        }
        return title;
    }

    inizializzaSediTreeview(): void {
        this.subscription.add(
            this.listeSediNavbar$.subscribe((listaSedi: TreeItem) => {
                this.listeSediNavbar = [];
                this.listeSediNavbar[0] = new TreeviewItem(listaSedi);
            })
        );
    }

    onPatchSedi(event: TreeviewSelezione[]): void {
        this.f.sedeA.patchValue(event);
    }

    getSediSelezionate(): void {
        this.subscription.add(
            this.sediSelezionate$.subscribe((sedi: TreeviewSelezione[]) => {
                const listaSediNavbar = this.store.selectSnapshot(SediTreeviewState.listeSediNavbar);
                if (listaSediNavbar && sedi && sedi.length >= 0) {
                    switch (sedi.length) {
                        case 0:
                            this.sediSelezionate = 'nessuna sede selezionata';
                            break;
                        case 1:
                            this.sediSelezionate = findItem(listaSediNavbar, sedi[0].idSede).text;
                            break;
                        default:
                            this.sediSelezionate = 'più sedi selezionate';
                            break;
                    }
                } else {
                    this.sediSelezionate = 'Seleziona una o più sedi';
                }
            })
        );
    }

    inizializzaUser(): void {
        this.subscription.add(
            this.user$.subscribe((user: Utente) => {
                console.log('inizializzaUser', user);
                this.store.dispatch(
                    new UpdateFormValue({
                        path: 'trasferimentoChiamataModal.trasferimentoChiamataForm',
                        value: {
                            operatore: user.nome + ' ' + user.cognome
                        }
                    })
                );
            })
        );
    }

    getCodiciRichiesteTrasferibili(): void {
        this.store.dispatch(new GetRichiesteTrasferibili());
    }

    onConferma(): void {
        this.submitted = true;

        if (!this.trasferimentoChiamataForm.valid) {
            return;
        }

        this.modal.close({ success: true, result: this.trasferimentoChiamataForm.value });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }
}
