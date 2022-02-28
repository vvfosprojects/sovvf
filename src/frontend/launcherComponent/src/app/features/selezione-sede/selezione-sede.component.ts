import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { LoadingState } from '../../shared/store/states/loading/loading.state';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { AuthState } from '../auth/store/auth.state';
import { Ruolo, Utente } from '../../shared/model/utente.model';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { ViewportState } from '../../shared/store/states/viewport/viewport.state';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSedeCurrentUser } from '../auth/store/auth.actions';

@Component({
    templateUrl: 'selezione-sede.component.html',
    styleUrls: ['selezione-sede.component.css']
})
export class SelezioneSedeComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    loading: boolean;
    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(AuthState.currentUser) currentUser$: Observable<Utente>;
    currentUser: Utente;

    ruoliUtente: Ruolo[];

    selezioneSedeForm: FormGroup;
    submitted = false;
    error = '';

    private subscription = new Subscription();

    constructor(private formBuilder: FormBuilder,
                private authenticationService: AuthService,
                private store: Store) {
        this.getLoading();
        this.getDoubleMonitor();
        this.getCurrentUser();
    }

    ngOnInit(): void {
        this.store.dispatch(new StopBigLoading());
        this.initForm();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get f(): any {
        return this.selezioneSedeForm.controls;
    }

    getLoading(): void {
        this.subscription.add(
            this.loading$.subscribe((loading: boolean) => this.loading = loading)
        );
    }

    getDoubleMonitor(): void {
        this.subscription.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => this.doubleMonitor = doubleMonitor)
        );
    }

    getCurrentUser(): void {
        this.subscription.add(
            this.currentUser$.subscribe((currentUser: Utente) => {
                if (!currentUser) {
                    this.store.dispatch(new Navigate(['/' + RoutesPath.Login]));
                } else {
                    this.currentUser = currentUser;
                    this.setRuoliUtenteUnique();
                }
            })
        );
    }

    setRuoliUtenteUnique(): void {
        this.currentUser.ruoli.forEach((ruolo: Ruolo) => {
            if (!this.ruoliUtente?.map((r: Ruolo) => r.codSede).includes(ruolo.codSede)) {
                if (!this.ruoliUtente) {
                    this.ruoliUtente = [];
                }
                this.ruoliUtente.push(ruolo);
            }
        });
    }

    initForm(): void {
        this.selezioneSedeForm = this.formBuilder.group({
            codSede: ['', Validators.required]
        });
        this.detectFormValueChanges();
        if (this.ruoliUtente?.length) {
            this.selectSedeInit();
        }
    }

    selectSedeInit(): void {
        this.f.codSede.patchValue(this.ruoliUtente[0].codSede);
    }

    detectFormValueChanges(): void {
        this.selezioneSedeForm.valueChanges.subscribe((formValue) => {
            if (formValue?.codSede && this.ruoliUtente?.length === 1) {
                this.onSubmit();
            }
        });
    }

    onSubmit(): void {
        this.submitted = true;
        this.error = '';

        if (this.selezioneSedeForm.invalid) {
            return;
        }

        this.store.dispatch(new SetSedeCurrentUser(this.f.codSede.value));
    }
}
