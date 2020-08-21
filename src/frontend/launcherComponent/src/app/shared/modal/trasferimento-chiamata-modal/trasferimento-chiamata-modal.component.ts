import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { makeCopy } from '../../helper/function';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { Utente } from '../../model/utente.model';
import { ClearListaSediNavbar, PatchListaSediNavbar } from '../../store/actions/sedi-treeview/sedi-treeview.actions';
import { GetRichiesteTrasferibili } from '../../store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { UpdateFormValue } from '@ngxs/form-plugin';

@Component({
    selector: 'app-trasferimento-chiamata-modal',
    templateUrl: './trasferimento-chiamata-modal.component.html',
    styleUrls: ['./trasferimento-chiamata-modal.component.css']
})
export class TrasferimentoChiamataModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(TrasferimentoChiamataModalState.codiciRichiesteTrasferibili) codiciRichiesteTrasferibili$: Observable<string[]>;
    @Select(TrasferimentoChiamataModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(SediTreeviewState.listeSediNavbar) listeSediNavbar$: Observable<TreeItem>;
    listeSediNavbar: TreeviewItem[];
    // @Select(TrasferimentoChiamataModalState.sedeSelezionata) sediSelezionate$: Observable<TreeviewSelezione[]>;
    // sediSelezionate: string;

    operatore: string;
    idRichiesta: string;
    editTrasferimentoChiamata: TrasferimentoChiamata;

    trasferimentoChiamataForm: FormGroup;
    submitted: boolean;

    @Select(SediTreeviewState.listeSediLoaded) listeSediLoaded$: Observable<boolean>;
    private listeSediLoaded: boolean;
    @Select(AuthState.currentUser) user$: Observable<Utente>;
    user: Utente;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.getCodiciRichiesteTrasferibili();
        this.initForm();
        this.getFormValid();
    }

    ngOnInit() {
        this.inizializzaSediTreeview();
        this.inizializzaUser();
    }

    initForm() {
        const sede = this.store.selectSnapshot(SediTreeviewState);
        this.trasferimentoChiamataForm = new FormGroup({
            codiceRichiesta: new FormControl(),
            operatore: new FormControl(),
            sedeDa: new FormControl(),
            sedeA: new FormControl(),
            data: new FormControl()
        });
        this.trasferimentoChiamataForm = this.fb.group({
            codiceRichiesta: [null, Validators.required],
            operatore: [null, Validators.required],
            sedeDa: [null, Validators.required],
            sedeA: [null, Validators.required],
            data: [null, Validators.required]
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
        let title = 'Aggiungi Trasferimento Chiamata';
        if (this.editTrasferimentoChiamata) {
            title = 'Modifica ' + this.editTrasferimentoChiamata.codRichiesta;
        }
        return title;
    }

    inizializzaSediTreeview() {
        this.subscription.add(
            this.listeSediNavbar$.subscribe((listaSedi: TreeItem) => {
                this.listeSediNavbar = makeCopy(listaSedi.children);
                this.listeSediNavbar[0] = new TreeviewItem(listaSedi);
            })
        );
    }

    onPatchSedi(event: TreeviewSelezione[]) {
        this.f.sedi.patchValue(event);
    }

    // getSediSelezionate() {
    //     this.subscription.add(
    //         this.sediSelezionate$.subscribe((sedi: TreeviewSelezione[]) => {
    //             const listaSediNavbar = this.store.selectSnapshot(SediTreeviewState.listeSediNavbar);
    //             if (listaSediNavbar && sedi && sedi.length >= 0) {
    //                 switch (sedi.length) {
    //                     case 0:
    //                         this.sediSelezionate = 'nessuna sede selezionata';
    //                         break;
    //                     case 1:
    //                         this.sediSelezionate = findItem(listaSediNavbar, sedi[0].idSede).text;
    //                         break;
    //                     default:
    //                         this.sediSelezionate = 'più sedi selezionate';
    //                         break;
    //                 }
    //             } else {
    //                 this.sediSelezionate = 'Caricamento...';
    //             }
    //         })
    //     );
    // }

    inizializzaUser() {
        this.subscription.add(
            this.user$.subscribe((user: Utente) => {
                if (user) {
                    console.log('inizializzaUser', user);
                    this.store.dispatch(
                        new UpdateFormValue({
                            path: 'trasferimentoChiamataModal.trasferimentoChiamataForm',
                            value: {
                                operatore: user.nome + ' ' + user.cognome
                            }
                        })
                    );
                    if (user.sede) {
                        this.listeSediLoaded && this.store.dispatch(new PatchListaSediNavbar([user.sede.codice]));
                    }
                } else {
                    this.store.dispatch(new ClearListaSediNavbar());
                }
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

        this.modal.close({ status: 'ok', result: this.trasferimentoChiamataForm.value });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string) {
        this.modal.close(type);
    }


}
