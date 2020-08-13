import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrasferimentoChiamata } from '../../interface/trasferimento-chiamata.interface';
import { TrasferimentoChiamataState } from '../../store/states/trasferimento-chiamata/trasferimento-chiamata.state';
import { TreeviewItem, TreeItem } from 'ngx-treeview';
import { SediTreeviewState } from '../../store/states/sedi-treeview/sedi-treeview.state';
import { TreeviewSelezione } from '../../model/treeview-selezione.model';
import { findItem } from '../../store/states/sedi-treeview/sedi-treeview.helper';

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

  subscription: Subscription = new Subscription();

  constructor(private store: Store,
              private modal: NgbActiveModal,
              private fb: FormBuilder) { 
                this.initForm();
                this.getFormValid();
                this.inizializzaSediTreeview();
                
              }

  ngOnInit() {
    this.operatore ? this.f.operatore.patchValue(this.operatore) : this.f.operatore.patchValue('');
  }

  initForm() {
    this.trasferimentoChiamataForm = this.fb.group({
        idRichiesta: ['', Validators.required],
        operatore: ['', Validators.required],
        codice: ['', Validators.required],
        sedeDa: ['', Validators.required],
        sedeA: ['', Validators.required],
        data: ['', Validators.required],
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

  onConferma() {
    this.submitted = true;

    if (!this.formValid) {
        return;
    }

    this.modal.close({ success: true });
  }

  onDismiss(): void {
    this.modal.dismiss('ko');
  }

  closeModal(type: string) {
    this.modal.close(type);
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
            this.listeSediNavbar = [];
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

}
