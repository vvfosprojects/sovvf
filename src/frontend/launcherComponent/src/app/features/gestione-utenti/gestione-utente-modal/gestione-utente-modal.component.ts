import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GestioneUtentiState } from '../store/states/gestione-utenti/gestione-utenti.state';
import { UtenteVvfInterface } from '../../../shared/interface/utente-vvf.interface';
import { Role, Ruolo } from '../../../shared/model/utente.model';
import { DistaccamentiState } from '../../../shared/store/states/distaccamenti/distaccamenti.state';
import { Sede } from '../../../shared/model/sede.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { makeCopy } from '../../../shared/helper/function-generiche';

@Component({
    selector: 'app-gestione-utente-modal',
    templateUrl: './gestione-utente-modal.component.html',
    styleUrls: ['./gestione-utente-modal.component.css']
})
export class GestioneUtenteModalComponent implements OnInit, OnDestroy {

    @Select(GestioneUtentiState.loadingGestioneUtenti) loading$: Observable<boolean>;
    @Select(GestioneUtentiState.listaUtentiVVF) listaUtentiVVF$: Observable<UtenteVvfInterface[]>;
    listaUtentiVVF: UtenteVvfInterface[];
    @Select(GestioneUtentiState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(DistaccamentiState.distaccamenti) distaccamenti$: Observable<Sede[]>;
    distaccamenti: Sede[];

    ruoli: string[] = [];

    addUtenteRuoloForm: FormGroup;
    checkboxState: { id: string, status: boolean, label: string, disabled: boolean };
    submitted: boolean;

    // aggiungi ruolo utente
    addRuoloUtente: boolean;
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
        this.getSedeValueChanges();
        this.getListaUtentiVVF();
        this.getDistaccamenti();
    }

    initForm(): void {
        this.addUtenteRuoloForm = new FormGroup({
            utente: new FormControl(),
            sede: new FormControl(),
            ricorsivo: new FormControl(),
            ruolo: new FormControl()
        });
        this.addUtenteRuoloForm = this.fb.group({
            utente: [null, Validators.required],
            sede: [null, Validators.required],
            ricorsivo: [true, Validators.required],
            ruolo: [{ value: null, disabled: true }, Validators.required]
        });
        // Init disabled input
        this.checkboxState = { id: 'ricorsivo', status: this.f.ricorsivo.value, label: 'Ricorsivo', disabled: true };
    }

    ngOnInit(): void {
        if (this.codFiscaleUtenteVVF) {
            this.setRuoli();
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

    getListaUtentiVVF(): void {
        this.subscription.add(
            this.listaUtentiVVF$.subscribe((listaUtentiVVF: UtenteVvfInterface[]) => {
                this.addUtenteRuoloForm.reset();
                this.f.ricorsivo.patchValue(true);
                if (listaUtentiVVF?.length) {
                    this.listaUtentiVVF = listaUtentiVVF;

                    if (listaUtentiVVF.length === 1) {
                        this.f.utente.patchValue(listaUtentiVVF[0].codiceFiscale);
                    }
                } else {
                    this.listaUtentiVVF = null;
                }
            })
        );
    }

    getDistaccamenti(): void {
        this.subscription.add(
            this.distaccamenti$.subscribe((distaccamenti: Sede[]) => {
                this.distaccamenti = makeCopy(distaccamenti);
                if (this.distaccamenti?.length) {
                    const sedeCON = new Sede('00', 'CON', new Coordinate(42.221895, 13.169548), '', '', '', '');
                    this.distaccamenti.push(sedeCON);
                }
            })
        );
    }

    setRuoli(): void {
        const codSedeSelezionata = this.f.sede.value;
        const sedeSelezionata = this.distaccamenti.filter((s: Sede) => s.codice === codSedeSelezionata)[0];
        switch (sedeSelezionata?.tipo) {
            case 'direzione':
                this.ruoli = [...Object.values(Role)];
                break;
            case 'comando':
                this.ruoli = [...Object.values(Role)];
                break;
            case 'distaccamento':
                this.ruoli = [Role.Visualizzatore];
                break;
            default:
                this.ruoli = [Role.Visualizzatore];
                break;
        }
    }

    setRicorsivoValue(value: { id: string, status: boolean }): void {
        this.checkboxState.status = value.status;
        this.f[value.id].patchValue(value.status);
    }

    getUtenteValueChanges(): void {
        this.f.utente.valueChanges.subscribe((value: any) => {
            if (value) {
                this.checkboxState.disabled = false;
                this.f.sede.enable();
            } else {
                this.checkboxState.disabled = true;
                this.f.sede.patchValue(null);
                this.f.sede.disable();
                this.f.ruolo.disable();
            }
        });
    }

    getSedeValueChanges(): void {
        this.f.sede.valueChanges.subscribe((value: any) => {
            if (value) {
                this.setRuoli();
                this.f.ruolo.patchValue(null);
                this.f.ruolo.enable();
            } else {
                this.f.ruolo.patchValue(null);
                this.f.ruolo.disable();
            }
        });
    }

    onConferma(): void {
        this.submitted = true;

        if (!this.formValid) {
            this.submitted = false;
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
