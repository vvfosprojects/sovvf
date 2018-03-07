import { UserLoginAction } from "../actions/user";
import { AuthenticationService } from '../login/_services/index';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { of } from 'rxjs/observable/of';

import * as user from '../actions/user';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class UserEffects {
    @Effect()
    update$: Observable<Action> = this.actions$
        .ofType<user.UserLoginAction>(user.USERLOGIN)
        .switchMap(action =>
            this.authenticationService.login(action.payload.username, 
                                             action.payload.password)
            .map(data => new UserLoginAction(data), error => {
                console.log("errore autenticazione."+error);
              //  this.alertService.error(error);
              //  this.loading = false;
            })            
        );
        
        
    constructor(
        private authenticationService: AuthenticationService,
        private actions$: Actions
    ) {}
}