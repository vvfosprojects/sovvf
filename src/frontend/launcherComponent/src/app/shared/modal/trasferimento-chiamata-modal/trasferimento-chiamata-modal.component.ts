import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrasferimentoChiamata } from '../../interface/trasferimento-chiamata.interface';
import { TrasferimentoChiamataModalState } from '../../store/states/trasferimento-chiamata-modal/trasferimento-chiamata-modal.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { SediTreeviewState } from '../../store/states/sedi-treeview/sedi-treeview.state';
import { TreeviewSelezione } from '../../model/treeview-selezione.model';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { Utente } from '../../model/utente.model';
import { GetRichiesteTrasferibili } from '../../store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { findItem } from '../../store/states/sedi-treeview/sedi-treeview.helper';

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
    }

    ngOnInit() {
        if (!this.codRichiesta) {
            this.getCodiciRichiesteTrasferibili();
        } else {
            this.f.codiceRichiesta.patchValue(this.codRichiesta);
            this.f.codiceRichiesta.disable();
        }
    }

    initForm() {
        this.trasferimentoChiamataForm = new FormGroup({
            codiceRichiesta: new FormControl(),
            operatore: new FormControl(),
            sedeA: new FormControl()
        });
        this.trasferimentoChiamataForm = this.fb.group({
            codiceRichiesta: [null, Validators.required],
            operatore: [null, Validators.required],
            sedeA: [null, Validators.required]
        });
        this.f.operatore.disable();
    }

    get f() {
        return this.trasferimentoChiamataForm.controls;
    }

    ngOnDestroy(): void {
        this.trasferimentoChiamataForm.reset();
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
        let title = 'Trasferimento Chiamata';
        if (this.codRichiesta) {
            title = 'Trasferisci la Chiamata ' + this.codRichiesta;
        }
        return title;
    }

    inizializzaSediTreeview() {
        this.subscription.add(
            this.listeSediNavbar$.subscribe((listaSedi: TreeItem) => {
                this.listeSediNavbar = [];
                this.listeSediNavbar[0] = new TreeviewItem(listaSedi);
            })
        );
    }

    onPatchSedi(event: TreeviewSelezione[]) {
        this.f.sedeA.patchValue(event);
    }

    getSediSelezionate() {
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

    inizializzaUser() {
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

    getCodiciRichiesteTrasferibili() {
        this.store.dispatch(new GetRichiesteTrasferibili());
    }

    onConferma() {
        this.submitted = true;

        if (!this.trasferimentoChiamataForm.valid) {
            return;
        }

        this.modal.close({ success: true, result: this.trasferimentoChiamataForm.value });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string) {
        this.modal.close(type);
    }
}
