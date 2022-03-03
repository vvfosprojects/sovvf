import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { LoadingState } from '../../shared/store/states/loading/loading.state';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { CasLogin, RecoveryUrl } from '../auth/store/auth.actions';
import { environment } from '../../../environments/environment';
import { AuthState } from '../auth/store/auth.state';
import { Utente } from '../../shared/model/utente.model';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { ViewportState } from '../../shared/store/states/viewport/viewport.state';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    private subscription = new Subscription();

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    loading: boolean;
    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(AuthState.currentUser) currentUser$: Observable<Utente>;

    loginForm: FormGroup;
    submitted = false;
    error = '';
    onlyCas = environment.onlyCas;
    loginVisible = false;

    constructor(private formBuilder: FormBuilder,
                private authenticationService: AuthService,
                private store: Store) {
        this.subscription.add(
            this.loading$.subscribe((loading: boolean) => this.loading = loading)
        );
        this.subscription.add(
            this.currentUser$.subscribe((currentUser: Utente) => {
                if (currentUser) {
                    this.store.dispatch(new Navigate([RoutesPath.Home]));
                } else {
                    this.loginVisible = true;
                }
            })
        );
        this.subscription.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => this.doubleMonitor = doubleMonitor)
        );
    }

    ngOnInit(): void {
        this.store.dispatch(new StopBigLoading());
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get f(): any {
        return this.loginForm.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        this.error = '';

        if (this.loginForm.invalid) {
            return;
        }

        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.store.dispatch(new RecoveryUrl());
                },
                error => {
                    this.submitted = false;
                    this.error = error;
                });
    }

    onCasLogin(): void {
        this.store.dispatch(new CasLogin());
    }
}
