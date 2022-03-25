import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrasferimentoChiamataModalState } from '../../store/states/trasferimento-chiamata-modal/trasferimento-chiamata-modal.state';
import { GetRichiesteTrasferibili } from '../../store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { DistaccamentiState } from '../../store/states/distaccamenti/distaccamenti.state';
import { Sede } from '../../model/sede.model';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { AppState } from '../../store/states/app/app.state';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { LockedConcorrenzaService } from '../../../core/service/concorrenza-service/locked-concorrenza.service';
import { AddTrasferimentoChiamata } from '../../interface/trasferimento-chiamata.interface';
import { TrasferimentoChiamataService } from '../../../core/service/trasferimento-chiamata/trasferimento-chiamata.service';

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
    @Select(DistaccamentiState.sediTrasferimenti) distaccamenti$: Observable<Sede[]>;
    distaccamenti: Sede[];
    @Select(AppState.vistaSedi) vistaSedi$: Observable<string[]>;
    vistaSedi: string[];

    codRichiesta: string;

    trasferimentoChiamataForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder,
                private lockedConcorrenzaService: LockedConcorrenzaService,
                private trasferimentoChiamataService: TrasferimentoChiamataService) {
        this.initForm();
        this.getFormValid();
        this.getSedi();
        this.getVistaSedi();
    }

    ngOnInit(): void {
        this.store.dispatch(
            new UpdateFormValue({
                path: 'trasferimentoChiamataModal.trasferimentoChiamataForm',
                value: {
                    codiceRichiesta: this.codRichiesta ? this.codRichiesta : null
                }
            })
        );
        this.f.codiceRichiesta.patchValue(this.codRichiesta);
        if (!this.codRichiesta) {
            this.getCodiciRichiesteTrasferibili();
        } else {
            this.f.codiceRichiesta.disable();
        }
    }

    initForm(): void {
        this.trasferimentoChiamataForm = new FormGroup({
            codiceRichiesta: new FormControl(),
            sedeDa: new FormControl(),
            sedeA: new FormControl()
        });
        this.trasferimentoChiamataForm = this.fb.group({
            codiceRichiesta: [null, Validators.required],
            sedeDa: [null],
            sedeA: [null, Validators.required],
        });
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

    getTitle(): string {
        let title = 'Trasferimento Chiamata';
        if (this.codRichiesta) {
            title = 'Trasferisci la Chiamata ' + this.codRichiesta;
        }
        return title;
    }

    getSedi(): void {
        this.subscription.add(
            this.distaccamenti$.subscribe((sedi: Sede[]) => {
                this.distaccamenti = sedi;
            })
        );
    }

    onPatchSedi(event: Sede): void {
        this.f.sedeA.patchValue(event);
    }

    getCodiciRichiesteTrasferibili(): void {
        this.store.dispatch(new GetRichiesteTrasferibili());
    }

    getVistaSedi(): void {
        this.subscription.add(
            this.vistaSedi$.subscribe((vistaSedi: string[]) => {
                if (vistaSedi?.length) {
                    this.vistaSedi = vistaSedi;
                    const sedeDa = this.distaccamenti.filter((d: Sede) => d.codice === vistaSedi[0])[0];
                    if (sedeDa) {
                        this.f.sedeDa.patchValue(sedeDa);
                    }
                }
            })
        );
    }

    addTrasferimentoChiamata(): void {
        const codChiamata = this.f.codiceRichiesta.value;
        const sedeDa = this.f.sedeDa.value;
        const sedeA = this.f.sedeA.value;
        const obj = {
            codChiamata,
            codSedeDa: sedeDa.codice,
            codSedeA: sedeA.codice
        } as AddTrasferimentoChiamata;
        this.trasferimentoChiamataService.addTrasferimentoChiamata(obj).subscribe(() => {
            this.closeModal('ok');
        }, () => this.submitted = false);
    }

    onConferma(): void {
        if (!this.isLockedConcorrenza()) {
            this.submitted = true;

            if (!this.trasferimentoChiamataForm.valid) {
                return;
            }

            this.addTrasferimentoChiamata();
        }
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }

    isLockedConcorrenza(): string {
        return this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.Richiesta, [this.codRichiesta]);
    }
}
