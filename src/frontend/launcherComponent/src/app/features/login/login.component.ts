import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { LoadingState } from '../../shared/store/states/loading/loading.state';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { CasLogin, RecoveryUrl } from '../auth/store/auth.actions';
import { environment } from '../../../environments/environment';


@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit, OnDestroy {

    private subscription = new Subscription();

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    loading: boolean;

    loginForm: FormGroup;
    submitted = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthService,
        private store: Store) {
        if (environment.onlyCas) {
            this.onCasLogin();
        } else {
            this.subscription.add(
                this.loading$.subscribe((loading: boolean) => this.loading = loading)
            );
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: [ '', Validators.required ],
            password: [ '', Validators.required ]
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;

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
                    this.error = error;
                });
    }

    onCasLogin() {
        this.store.dispatch(new CasLogin());
    }
}
