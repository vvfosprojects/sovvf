import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GestioneUtentiState } from '../store/states/gestione-utenti/gestione-utenti.state';
import { UtenteVvfInterface } from '../../../shared/interface/utente-vvf.interface';
import { ClearUtentiVVF, GetUtentiVVF } from '../store/actions/gestione-utenti/gestione-utenti.actions';
import { Role, Ruolo } from '../../../shared/model/utente.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DistaccamentiState } from '../../../shared/store/states/distaccamenti/distaccamenti.state';
import { Sede } from '../../../shared/model/sede.model';

@Component({
    selector: 'app-gestione-utente-modal',
    templateUrl: './gestione-utente-modal.component.html',
    styleUrls: ['./gestione-utente-modal.component.css']
})
export class GestioneUtenteModalComponent implements OnInit, OnDestroy {

    @Select(GestioneUtentiState.loadingGestioneUtenti) loading$: Observable<boolean>;
    @Select(GestioneUtentiState.listaUtentiVVF) listaUtentiVVF$: Observable<UtenteVvfInterface[]>;
    @Select(GestioneUtentiState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(DistaccamentiState.distaccamenti) distaccamenti$: Observable<Sede[]>;
    distaccamenti: Sede[];

    ruoli: string[] = [];

    addUtenteRuoloForm: FormGroup;
    typeahead = new Subject<string>();
    checkboxState: { id: string, status: boolean, label: string, disabled: boolean };
    submitted: boolean;

    // aggiungi ruolo utente
    codFiscaleUtenteVVF: string;
    nominativoUtenteVVF: string;
    ruoliAttuali: Ruolo[];

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
        this.getUtenteValueChanges();
        this.getUtentiVVF();
        this.getSearchUtentiVVF();
        this.getDistaccamenti();
    }

    initForm(): void {
        this.addUtenteRuoloForm = new FormGroup({
            utente: new FormControl(),
            sedi: new FormControl(),
            ricorsivo: new FormControl(),
            ruolo: new FormControl()
        });
        this.addUtenteRuoloForm = this.fb.group({
            utente: [null, Validators.required],
            sedi: [null, Validators.required],
            ricorsivo: [true],
            ruolo: [null, Validators.required]
        });
        // Init disabled input
        this.checkboxState = { id: 'ricorsivo', status: this.f.ricorsivo.value, label: 'Ricorsivo', disabled: true };
        this.f.ruolo.disable();
    }

    ngOnInit(): void {
        if (this.codFiscaleUtenteVVF) {
            this.setRuoli({ removeVisualizzatore: true });
            this.f.utente.patchValue(this.codFiscaleUtenteVVF);
            this.f.utente.clearValidators();
        } else if (!this.codFiscaleUtenteVVF) {
            this.setRuoli();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    get f(): any {
        return this.addUtenteRuoloForm.controls;
    }

    getUtentiVVF(search?: string): void {
        if (search && search.length >= 3) {
            this.store.dispatch(new GetUtentiVVF(search));
        } else {
            this.store.dispatch(new ClearUtentiVVF());
        }
    }

    getSearchUtentiVVF(): void {
        this.typeahead.pipe(
            distinctUntilChanged(),
            debounceTime(500)
        ).subscribe((term) => {
            this.getUtentiVVF(term);
        });
    }

    getDistaccamenti(): void {
        this.subscription.add(
            this.distaccamenti$.subscribe((distaccamenti: Sede[]) => {
                this.distaccamenti = distaccamenti;
            })
        );
    }

    setRuoli(opts?: { removeVisualizzatore?: boolean }): void {
        Object.values(Role).forEach((role: string) => {
            if (opts && opts.removeVisualizzatore && role === Role.Visualizzatore) {
                return;
            }
            this.ruoli.push(role);
        });
    }

    setRicorsivoValue(value: { id: string, status: boolean }): void {
        this.checkboxState.status = value.status;
        this.f[value.id].patchValue(value.status);
    }

    getUtenteValueChanges(): void {
        this.f.utente.valueChanges.subscribe((value: any) => {
            if (value) {
                this.checkboxState.disabled = false;
                this.f.sedi.enable();
                this.f.ruolo.enable();
            } else {
                this.checkboxState.disabled = true;
                this.f.sedi.disable();
                this.f.ruolo.disable();
            }
        });
    }

    getSediValueChanges(): void {
        this.f.sedi.valueChanges.subscribe((value: any) => {
            if (value) {
                this.checkboxState.disabled = false;
            } else {
                this.checkboxState.disabled = true;
            }
        });
    }

    onConferma(): void {
        this.submitted = true;

        if (!this.formValid) {
            return;
        }

        this.modal.close({ success: true });
    }

    onDismiss(): void {
        this.modal.dismiss('cross');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }
}
