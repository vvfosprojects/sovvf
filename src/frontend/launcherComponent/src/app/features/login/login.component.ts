import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../core/auth/_services';
import { Select } from '@ngxs/store';
import { LoadingState } from '../../shared/store/states/loading/loading.state';
import { Observable } from 'rxjs';


@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    loading: boolean;

    loginForm: FormGroup;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService) {
        this.loading$.subscribe((loading: boolean) => this.loading = loading);
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.authenticationService.logout();

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                });
    }
}
