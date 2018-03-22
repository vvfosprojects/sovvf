import { UserloginAction, UserloginSuccess, UserloginFail } from './../actions/user';
import { AuthenticationService } from './../login/_services';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

import * as user from '../actions/user';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class UserEffects {
    @Effect()
    login$: Observable<Action> = this.actions$
        .ofType<user.UserloginAction>(user.USERLOGIN)
        .map(action => action.payload)
        .switchMap(id => this.authenticationService.login(id.username,
                                                          id.password)
            .map(res => new user.UserloginSuccess(res))
            .catch(error => of(new user.UserloginFail(error))) //cambiami.
        );

    constructor(
        private authenticationService: AuthenticationService,
        private actions$: Actions
    ) {}
}