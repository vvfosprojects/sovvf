import { UserloginSuccess, UserloginAction, UserloginFail, Userlogout } from '../store/actions/user';
import { Store } from '@ngrx/store';

import * as fromRoot from '../store/reducers';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { Observable } from 'rxjs/Observable';

import { AlertService, AuthenticationService, UserService } from '../login/_services/index';
import { User } from './_models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    model: any = {};
    modelr: any = {};
    loading$: Observable<boolean>;
    returnUrl: string;
    private sottoscrizione;
    public userSuccess$: Observable<User>;
    public userFail$: Observable<any>;



    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        public store: Store<fromRoot.State>,
        private _ngZone: NgZone
    ) {
        this.userSuccess$ = store.select(fromRoot.getUserLoginSuccessState);
        this.userFail$ = store.select(fromRoot.getUserLoginFailState);
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log("qui...");
        console.log("loading = " + this.loading$);

        this.userSuccess$.subscribe(
            n => {
                if (n != undefined) {
                    console.log("utente obs " + JSON.stringify(n));
                    this.router.navigate([this.returnUrl]);
                }

            },
            e => console.log(e)
        )
        this.sottoscrizione = this.userFail$.subscribe(
            n => {
                if (n != undefined) {
                    console.log("login fallito obs " + n);

                    this._ngZone.run(() => {
                        this.alertService.error(n);
                        this.loading$ = Observable.of(false);
                    })
                    console.log("login fallito obs eseguito " + n);
                }
                e => console.log("errore in userFail$ "+e)
            })
            
    }

    ngOnDestroy() {
        console.log("istanza componente distrutta");
        this.sottoscrizione.unsubscribe();
        // TODO spostare le 2 righe di codice seguenti nell'azione di logout
        // menu sidebar di Uscita.
        this.authenticationService.logout();
        this.store.dispatch(new Userlogout(""));
        //
    }

    onLoggedin() {
        console.log("pure qui..." + this.model.username + this.model.password);
        this.loading$ = Observable.of(true);
        console.log("loading = " + this.loading$);
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
                this.loading$ = Observable.of(false);
            });


        //TODO viene fatto il dispatch dell'action con effect. e la chiamata al service
        // sottostante è stata messa nella cartella effects.

        this.store.dispatch(new UserloginAction(this.model));

        
        
        /*
              this.authenticationService.login(this.model.username, this.model.password)
              .subscribe(
                  data => {
                      console.log("in routing..");
                      this.store.dispatch(new UserloginSuccess(this.model));
                      this.userSuccess$.subscribe(
                          n => console.log("utente "+JSON.stringify(n)),
                          e => console.log(e)
                        )
                      this.router.navigate([this.returnUrl]);
                      console.log("routati");
                  },
                  error => {
                      console.log("errore autenticazione."+error);
                      this.alertService.error(error);
                      this.loading = false;
                  });
            */


        //localStorage.setItem('isLoggedin', 'true');
    }

}

