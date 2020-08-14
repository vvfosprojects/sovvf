import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TrasferimentoChiamata } from '../../interface/trasferimento-chiamata.interface';
import { TrasferimentoChiamataState } from '../../store/states/trasferimento-chiamata/trasferimento-chiamata.state';
import { TreeviewItem, TreeItem } from 'ngx-treeview';
import { SediTreeviewState } from '../../store/states/sedi-treeview/sedi-treeview.state';
import { TreeviewSelezione } from '../../model/treeview-selezione.model';
import { findItem } from '../../store/states/sedi-treeview/sedi-treeview.helper';
import { makeCopy } from '../../helper/function';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { Utente } from '../../model/utente.model';
import { PatchListaSediNavbar, ClearListaSediNavbar } from '../../store/actions/sedi-treeview/sedi-treeview.actions';

@Component({
  selector: 'app-trasferimento-chiamata-modal',
  templateUrl: './trasferimento-chiamata-modal.component.html',
  styleUrls: ['./trasferimento-chiamata-modal.component.css']
})
export class TrasferimentoChiamataModalComponent implements OnInit {

  @Select(LoadingState.loading) loading$: Observable<boolean>;
  @Select(TrasferimentoChiamataState.formValid) formValid$: Observable<boolean>;
  formValid: boolean;
  @Select(SediTreeviewState.listeSediNavbar) listeSediNavbar$: Observable<TreeItem>;
  listeSediNavbar: TreeviewItem[];
  @Select(TrasferimentoChiamataState.sedeSelezionata) sediSelezionate$: Observable<TreeviewSelezione[]>;
  sediSelezionate: string;

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
                this.initForm();
                this.getFormValid();
                this.inizializzaSediTreeview();  
                this.inizializzaUser()             
              }

  ngOnInit() {
    this.user ? this.f.operatore.patchValue(this.user.nome + ' ' + this.user.cognome) : this.f.operatore.patchValue('');
  }

  initForm() {
    this.trasferimentoChiamataForm = new FormGroup({
        idRichiesta: new FormControl(),
        operatore: new FormControl(),
        codice: new FormControl(),
        sedeDa: new FormControl(),
        sedeA: new FormControl(),
        data: new FormControl(),
    });
    this.trasferimentoChiamataForm = this.fb.group({
        idRichiesta: [null, Validators.required],
        operatore: [null, Validators.required],
        codice: [null, Validators.required],
        sedeDa: [null, Validators.required],
        sedeA: [null, Validators.required],
        data: [null, Validators.required],
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
        title = 'Modifica ' + this.editTrasferimentoChiamata.codice;
    }
    return title;
  }

  inizializzaSediTreeview() {
    this.subscription.add(
        this.listeSediNavbar$.subscribe((listaSedi: TreeItem) => {
          const mod = makeCopy(listaSedi.children);
          this.listeSediNavbar = mod;
          this.listeSediNavbar[0] = new TreeviewItem(listaSedi);
        })
    );
  }

  onPatchSedi(event: TreeviewSelezione[]) {
    this.f.sedi.patchValue(event);
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
                this.sediSelezionate = 'Caricamento...';
            }
        })
    );
  }

 inizializzaUser() {
  this.subscription.add(this.user$.subscribe((user: Utente) => {
    this.user = user;
    if (user && user.sede) {
        this.listeSediLoaded && this.store.dispatch(new PatchListaSediNavbar([ user.sede.codice ]));
    } else {
        this.store.dispatch(new ClearListaSediNavbar());
    }
    }));
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
