import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GetUtentiVVF } from '../store/actions/gestione-utenti/gestione-utenti.actions';
import { Select, Store } from '@ngxs/store';
import { GestioneUtentiState } from '../store/states/gestione-utenti/gestione-utenti.state';
import { Observable, Subscription } from 'rxjs';
import { UtenteVvfInterface } from '../../../shared/interface/utente-vvf.interface';

@Component({
    selector: 'app-ricerca-utente-vvf',
    templateUrl: './ricerca-utente-vvf.component.html',
    styleUrls: ['./ricerca-utente-vvf.component.css']
})
export class RicercaUtenteVvfComponent implements OnInit, OnDestroy {

    @Select(GestioneUtentiState.loadingGestioneUtenti) loadingGestioneUtenti$: Observable<boolean>;
    loadingGestioneUtenti: boolean;
    @Select(GestioneUtentiState.listaUtentiVVF) listaUtentiVVF$: Observable<UtenteVvfInterface[]>;
    listaUtentiVVF: UtenteVvfInterface[];

    ricercaUtenteForm: FormGroup;
    submitted: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private fb: FormBuilder,
                private store: Store) {
        this.getLoading();
        this.getUtentiVVF();
    }

    ngOnInit(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getLoading(): void {
        this.subscriptions.add(
            this.loadingGestioneUtenti$.subscribe((loading: boolean) => {
                this.loadingGestioneUtenti = loading;
            })
        );
    }

    getUtentiVVF(): void {
        this.subscriptions.add(
            this.listaUtentiVVF$.subscribe((listaUtentiVVF: UtenteVvfInterface[]) => {
                this.listaUtentiVVF = listaUtentiVVF;
            })
        );
    }

    initForm(): void {
        this.ricercaUtenteForm = new FormGroup({
            nome: new FormControl(),
            cognome: new FormControl(),
            codiceFiscale: new FormControl()
        });
        this.ricercaUtenteForm = this.fb.group({
            nome: [null, [Validators.required]],
            cognome: [null, [Validators.required]],
            codiceFiscale: [null, [Validators.required, Validators.pattern('^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9]{11})$')]]
        });
    }

    get f(): any {
        return this.ricercaUtenteForm?.controls;
    }

    onFormValueChange(): void {
        if (this.f.nome.value || this.f.cognome.value) {
            this.f.codiceFiscale.clearValidators();
            this.f.codiceFiscale.disable();
        } else {
            this.f.codiceFiscale.setValidators([Validators.required, Validators.pattern('^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9]{11})$')]);
            this.f.codiceFiscale.enable();
        }
        if (this.f.codiceFiscale.value) {
            this.f.nome.clearValidators();
            this.f.cognome.clearValidators();
            this.f.nome.disable();
            this.f.cognome.disable();
        } else {
            this.f.nome.setValidators([Validators.required]);
            this.f.cognome.setValidators([Validators.required]);
            this.f.nome.enable();
            this.f.cognome.enable();
        }
    }

    onClearSubmitted(): void {
        this.submitted = false;
    }

    onRicercaUtenteVVF(): void {
        this.submitted = true;

        if (!this.ricercaUtenteForm.valid) {
            this.submitted = false;
            return;
        }

        const nome = this.f.nome?.value;
        const cognome = this.f.cognome?.value;
        const codiceFiscale = this.f.codiceFiscale?.value;
        this.store.dispatch(new GetUtentiVVF(nome, cognome, codiceFiscale));
    }
}
