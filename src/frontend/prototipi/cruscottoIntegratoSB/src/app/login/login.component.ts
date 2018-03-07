import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { Observable } from 'rxjs/Observable';

import { AlertService, AuthenticationService, UserService } from '../login/_services/index';

import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { UserLoginAction } from '../actions/user';
import { User } from './_models/index';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    model: any = {};
    modelr: any =  {};
    loading = false;
    returnUrl: string;
    public userLogin$ : Observable<User>;
    public userLoginSuccess$ : Observable<User>;

    constructor(
        public store: Store<fromRoot.State>,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {
            this.userLogin$ = store.select(fromRoot.getUserLoginState);
            this.userLoginSuccess$ = store.select(fromRoot.getUserLoginSuccessState);
        }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        
                // get return url from route parameters or default to '/'
                this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                console.log("qui...");
                console.log("loading = "+this.loading);
    }

    onLoggedin() {
        console.log("pure qui..."+this.model.username+this.model.password);
        this.loading = true;
        console.log("loading = "+this.loading);
        //creazione utente fittizio.
        localStorage.removeItem('users');
        this.modelr.username = "vvf";
        this.modelr.password = "vvf";

        //TODO qui verrà fatto il dispatch dell'action con effect. e la chiamata al service
        // sottostante dovrebbe andare nella cartella effects.
        this.userService.create(this.modelr)
        .subscribe(
            data => {
             //   this.alertService.success('Registration successful', true);
             //   this.router.navigate(['/login']);
            },
            error => {
             //   this.alertService.error(error);
                this.loading = false;
            });

          /*  console.log("dispaccio azione");
            this.store.dispatch(new UserLoginAction(this.modelr));
            console.log("utente "+this.user$[1]);
*/
            //TODO qui verrà fatto il dispatch dell'action con effect. e la chiamata al service
            // sottostante dovrebbe andare nella cartella effects.
      
            this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    console.log("in routing..");
                    this.router.navigate([this.returnUrl]);
                    console.log("routati");
                },
                error => {
                    console.log("errore autenticazione."+error);
                    this.alertService.error(error);
                    this.loading = false;
                });
                

                 
        //localStorage.setItem('isLoggedin', 'true');
    }
}
